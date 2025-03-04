# Physical Store

## Descrição

A aplicação **Physical Store** permite a localização de lojas físicas dentro de um raio de 100 km a partir de um CEP fornecido pelo usuário. A aplicação utiliza a API do ViaCEP para obter o endereço do CEP informado e a API do OpenRouteService para calcular a distância entre o endereço fornecido e as lojas cadastradas no sistema.

## Funcionalidades

- **Listar todas as lojas**: Exibe todas as lojas cadastradas no banco de dados.
- **Cadastrar novas lojas**: Permite a criação de novas lojas informando nome, endereço, CEP e coordenadas (latitude e longitude).
- **Buscar lojas próximas**: Localiza as lojas físicas mais próximas a partir de um CEP fornecido, exibindo apenas as lojas dentro de um raio de 100 km.
- **Tratamento de erros**: Mensagens informativas para CEPs inválidos ou quando não há lojas no raio especificado.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução do JavaScript.
- **Express.js**: Framework para construção das rotas e APIs.
- **MongoDB com Mongoose**: Banco de dados NoSQL para armazenamento das lojas.
- **ViaCEP API**: Para buscar o endereço baseado no CEP fornecido.
- **OpenRouteService API**: Para cálculo das distâncias entre as lojas e o CEP fornecido.
- **Axios**: Cliente HTTP para realizar requisições às APIs externas.
- **CORS**: Middleware para habilitar o acesso de diferentes origens à API.

## Estrutura do Projeto

```
PhysicalStore/
│
├── src/
│   ├── controllers/
│   │   └── storesController.js  # Lógica das operações CRUD e cálculo de distância
│   │
│   ├── data/
│   │   ├── import-dev-data.js   # Script para popular o banco de dados
│   │   └── stores.json          # Dados das lojas fictícias
│   │
│   ├── models/
│   │   └── storeModel.js        # Modelo Mongoose para as lojas
│   │
│   ├── routes/
│   │   └── storesRoutes.js      # Definição das rotas da API
│   │
│   ├── services/
│   │   ├── viacepService.js     # Integração com a API ViaCEP
│   │   ├── geocodingService.js  # Serviço para buscar coordenadas (OpenRouteService)
│   │   └── distanceService.js   # Cálculo de distâncias entre coordenadas
│   │
│   ├── utils/
│   │   └── logger.js            # Serviço de logs
│   │
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Configuração do servidor e conexão com o banco
│
├── .env                         # Variáveis de ambiente
├── package.json                 # Dependências do projeto
└── README.md                    # Documentação do projeto
```

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/PhysicalStore.git
cd PhysicalStore
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env`:

```env
DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster.mongodb.net/PhysicalStore
DATABASE_PASSWORD=your_password
PORT=3000
ORS_API_KEY=your_openroute_api_key
```

4. Popule o banco de dados:

```bash
node src/data/import-dev-data.js
```

5. Inicie o servidor:

```bash
npm start
```

## Rotas da API

| Método | Rota                     | Descrição                               |
| ------ | ------------------------ | --------------------------------------- |
| GET    | /api/stores              | Lista todas as lojas                    |
| POST   | /api/stores              | Cadastra uma nova loja                  |
| GET    | /api/stores/buscar/\:cep | Busca lojas próximas a um CEP fornecido |

## Exemplo de Requisição

### **Cadastro de Lojas**

```http
POST /api/stores
```

```json
{
    "name": "Loja Exemplo",
    "endereco": "Rua Exemplo, 123",
    "cep": "01001-000",
    "coordenadas": {
        "latitude": -23.5505,
        "longitude": -46.6333
    }
}
```

## Testando a Aplicação

Você pode testar a API utilizando ferramentas como **Postman**, **Insomnia** ou diretamente pelo terminal com **curl**.

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Autor

Desenvolvido por João Henrique.

