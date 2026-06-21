// This runs on Vercel's server, not in the browser — so your API key
// never gets exposed to anyone visiting the site.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scheme, meetingType, date, notes } = req.body || {};

  if (!notes || !notes.trim()) {
    return res.status(400).json({ error: 'No meeting notes provided' });
  }

  const systemPrompt = `You are an expert strata scheme secretary in New South Wales, Australia, drafting formal meeting minutes that comply with the NSW Strata Schemes Management Act. Transform rough notes into polished, professional, properly structured minutes.

Structure the output with these sections, using clean plain-text headers (no markdown asterisks):
- Title (scheme name, meeting type)
- Date, time, and location (use what was given, or write "[not specified]")
- Attendance (Present, Apologies, Proxies if mentioned)
- Quorum confirmation statement
- Numbered agenda items, each with: the matter discussed, key points raised, and the resolution/motion outcome (carried/not carried, votes if mentioned)
- Any actions arising, with a clear owner if mentioned
- Meeting close time
- Next meeting note if mentioned

Rules:
- Write in formal, neutral, third-person minute-taking style — never first person
- If information is missing or unclear, write "[not specified — please confirm]" rather than inventing details
- Do not invent names, figures, or outcomes not present in the source notes
- Keep tone factual and procedurally correct, suitable for legal record-keeping
- Output plain text with clear section breaks and spacing for structure, no markdown symbols`;

  const userMessage = `Scheme: ${scheme || '[Scheme name not provided]'}\nMeeting type: ${meetingType || 'Annual General Meeting'}\nMeeting date: ${date || '[Date not provided]'}\n\nRaw notes/transcript:\n${notes}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ error: 'Failed to generate draft. Please try again.' });
    }

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('\n').trim();

    if (!text) {
      return res.status(502).json({ error: 'No output returned. Please try again.' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
