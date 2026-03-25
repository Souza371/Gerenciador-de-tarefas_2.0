# Mobile - Gerenciador de Tarefas 2.0 (React Native + Expo)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (Android ou iOS)

### Instalação

```bash
cd mobile
npm install
```

### Iniciar Desenvolvimento

```bash
npm start
```

Duas opções:

#### Opção 1: Expo Go (Recomendado para desenvolvimento)
1. Um QR code aparecerá no terminal
2. Abra o Expo Go app no seu telefone
3. Escaneie o QR code
4. App abrirá no seu telefone

#### Opção 2: Android Emulator
```bash
npm run android
```

#### Opção 3: iOS Simulator (Mac only)
```bash
npm run ios
```

## 👤 Usuários de Teste

| Email | Senha |
|-------|-------|
| vicentedesouza762@gmail.com | Admin@2026 |
| clienteteste@projeto.com | Cliente@123 |

## ✨ Funcionalidades

✅ Login/Logout  
✅ Listagem de tarefas em tempo real  
✅ Marcar/desmarcar como concluída  
✅ Deletar tarefas  
✅ Persistência (AsyncStorage)  
✅ Sincronização com API  

## 📱 Telas

### Login Screen
```
┌─────────────────────┐
│  📋 Tarefas 2.0     │
│                     │
│ [seu@email.com...]  │
│ [sua_senha.........]│
│ [  ENTRAR  ]        │
└─────────────────────┘
```

### Home Screen (Tarefas)
```
┌─────────────────────────────┐
│ Minhas Tarefas | [Sair]     │
│ user@email.com              │
├─────────────────────────────┤
│ ┌─────────────────┐         │
│ │ 📋 Tarefa 1     │ [✓][🗑] │
│ │ Descrição...    │         │
│ │ trabalho média  │         │
│ └─────────────────┘         │
│ ┌─────────────────┐         │
│ │ 📋 Tarefa 2     │ [✓][🗑] │
│ │ ...             │         │
│ └─────────────────┘         │
└─────────────────────────────┘
```

## 🎨 Estrutura

```
mobile/
├── App.js           → Componente principal
├── app.json         → Config Expo
├── package.json     → Dependências
└── README.md        → Este arquivo
```

## 📦 Dependências

- `expo` - Framework React Native
- `react-native` - Framework mobile
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Persistência

## ⚙️ Configuração

A API é acessada em:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Para acessar backend local no real device
Se estiver testando em um telefone físico (não emulador):

1. Descubra seu IP local:
```bash
ifconfig  # Linux/Mac
ipconfig  # Windows
```

2. Atualize em `App.js`:
```javascript
const API_URL = 'http://192.168.1.100:5000/api'; // seu IP
```

## 🧪 Testes

1. **Login**: Use um dos usuários de teste
2. **Ver Tarefas**: Listagem aparece após login
3. **Concluir Tarefa**: Toque em ✓
4. **Deletar Tarefa**: Toque em 🗑
5. **Logout**: Toque em "Sair"

## 📱 Compatibilidade

- **Android**: 8.0+ (API 26+)
- **iOS**: 12.0+

## 🚀 Build para Produção

### Android
```bash
expo build:android
# Gera APK ou AAB para Google Play
```

### iOS
```bash
expo build:ios
# Gera IPA para App Store
```

## 🐛 Troubleshooting

### "Cannot find module 'sqlite3'"
- SQLite não funciona em React Native
- Mobile usa API na nuvem (não local)
- Certifique-se que o backend está rodando

### "Network error when fetching..."
- Verifique se o backend está rodando
- Confira o IP se estiver em device físico
- Certifique-se que não há firewall bloqueando

### App congela ao fazer login
- Teste a API com Postman ou curl
- Verifique logs do backend
- Reinicie o Expo server: `npm start`

---

**Desenvolvido com ❤️ por Vicente de Souza**
