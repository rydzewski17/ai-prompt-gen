import axios from 'axios';

const LLM_APIS = {
  openai: {
    key: process.env.OPENAI_API_KEY,
    url: 'https://api.openai.com/v1/chat/completions',
    modelList: ['gpt-4', 'gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
  },
};

export default async function handler(req, res) {
  const { query } = req.body;

  // 1) Determine best model
  const modelPrompt = `Which model is best suited for: "${query}"? Respond with model name only.`;
  const mResp = await axios.post(
    LLM_APIS.openai.url,
    { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: modelPrompt }] },
    { headers: { Authorization: `Bearer ${LLM_APIS.openai.key}` } }
  );
  const bestModel = mResp.data.choices[0].message.content.trim();

  // 2) Choose framework
  const frameworks = ['CARE', 'RACE', 'APE', 'CREATE', 'Coast'];
  const fPrompt = `Which prompt-engineering framework from ${frameworks.join(', ')} best structures: "${query}"? Respond with framework name only.`;
  const fResp = await axios.post(
    LLM_APIS.openai.url,
    { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: fPrompt }] },
    { headers: { Authorization: `Bearer ${LLM_APIS.openai.key}` } }
  );
  const framework = fResp.data.choices[0].message.content.trim();

  // 3) Generate improved prompt
  const improvePrompt = `Using the ${framework} framework, rewrite: "${query}"`;
  const iResp = await axios.post(
    LLM_APIS.openai.url,
    { model: bestModel, messages: [{ role: 'user', content: improvePrompt }] },
    { headers: { Authorization: `Bearer ${LLM_APIS.openai.key}` } }
  );
  const improvedPrompt = iResp.data.choices[0].message.content.trim();

  res.status(200).json({ bestModel, framework, improvedPrompt });
}