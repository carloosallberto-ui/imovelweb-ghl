const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const PORT = process.env.PORT || 3000;

app.post('/lead/imovelweb', async (req, res) => {
  try {
    const body = req.body;
    console.log('Lead recebido:', JSON.stringify(body, null, 2));

    const nomeCompleto = body.nome || body.name || body.nombre || 'Lead ImovelWeb';
    const [firstName, ...rest] = nomeCompleto.trim().split(' ');
    const lastName = rest.join(' ');
    const email = body.Email || body.txtEmail || body.email || null;
    const phone = body.phone || body.telefone || body.txtTelefone || null;
    const mensagem = body.Message || body.txtMensagem || null;
    const codigoImovel = body.claveInterna || body.codigoDoAnunciante || null;

    const payload = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email,
      phone,
      source: 'ImovelWeb',
      tags: ['imovelweb', 'portal']
    };

    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Contato criado no GHL:', data?.contact?.id);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erro:', error.message);
    return res.status(200).json({ success: false });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
