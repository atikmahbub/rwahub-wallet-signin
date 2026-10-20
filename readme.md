# RWAHub: Web3 Marketplace for Real-World Asset Tokenization

## Overview
RWAHub is a cutting-edge decentralized marketplace designed to bring real-world asset (RWA) tokenization into the Web3 era.
The platform empowers users to tokenize, fractionally own, and trade high-value assets — such as real estate, luxury watches, and fine jewelry — with ease and transparency.
By leveraging blockchain technology and smart contracts, RWAHub ensures secure, verifiable, and efficient transactions, making high-value investments accessible to everyone.

## Development Setup

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Quick Start
1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create local env** (required — frontend and backend will not start without `.env`)
   ```bash
   cp example.env .env
   ```
   Windows PowerShell: `Copy-Item example.env .env`
   Do not commit `.env`.

4. **Start development servers**
   ```bash
   npm run dev
   
5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Wallet Sign In changes

Sign In was MetaMask + local state, and a few cases were easy to get wrong: on the wrong
network you were sent to the dashboard before you could see the warning, a rejected popup
showed a generic error, the address was never in the Header, and Disconnect did a full page
reload. This branch fixes those without touching the server or contracts.

**What changed**

- The store now has one `walletStatus`: `no-wallet`, `disconnected`, `connecting`,
  `connected`, `wrong-network`, `rejected`, `error`. The UI renders from that instead of
  guessing from `loading` / `error` / `isAuthenticated`.
- MetaMask errors are mapped by code (4001 rejected, -32002 request already pending) to
  short messages, in `src/lib/wallet/errors.ts`.
- The Sign In modal shows a screen per status. On the wrong network it stays open with a
  "Switch network" button instead of redirecting.
- Header shows the connected address with a green / amber network dot. The dashboard has a
  small wallet card (copy address, network, switch, disconnect).
- Disconnect resets state and navigates to `/`, no reload. It also tries
  `wallet_revokePermissions` so the next Sign In asks MetaMask again.
- On page load the app checks `eth_accounts` / `eth_chainId` (no popup) and re-attaches the
  account/network listeners, so a locked wallet or switched account is picked up after a refresh.

**Files**

- `src/store/authStore.ts` - status, connect / switch / disconnect / sync
- `src/lib/wallet/errors.ts` - status type and error mapping
- `src/components/AuthModal.tsx` - Sign In states
- `src/components/layout/Header.tsx` - address chip and Disconnect
- `src/components/WalletStatusCard.tsx` - dashboard wallet card
- `src/App.tsx` - wallet sync on load, redirect only when on the right network

**Testing it by hand**

1. Disable MetaMask and open Sign In: you get the install link.
2. Connect and reject the popup: "You cancelled the request" + Try again.
3. Put the site on another chain, e.g. in the console:
   `ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }] })`,
   then sign in and reject the switch: the modal shows the wrong network screen.
4. Connect on the right network: address in the Header and on the dashboard.
5. Switch account or network in MetaMask: Header and card update without a refresh.
6. Disconnect: back to `/` with the Sign In button.



### 1. Asset Tokenization
**Purpose**: Converts physical assets into digital tokens on the blockchain.

**Process**:
- Asset owners submit ownership proof (e.g., deeds, certificates)
- Documentation verification process
- Smart contracts mint ERC-3643 tokens with verified metadata

**Benefit**: Ensures reliable asset digitization with blockchain verification.

### 2. Fractional Ownership
**Functionality**: Enables fractional investment in high-value assets.

**Implementation**:
- Token division based on asset value
- Automated ownership tracking via blockchain
- Fractional share management

**Benefit**: Makes high-value assets accessible to more investors.

### 3. Secure Marketplace
**Features**:
- Transparent price discovery
- Secure P2P transactions
- Real-time market data
- Smart contract-facilitated trades

**Benefit**: Creates an efficient, secure trading environment.

### 4. Robust Security
**Blockchain Integration**:
- Built on Ethereum/Polygon for scalability
- Transaction verification
- Automated compliance checks

**Smart Contracts**:
- Secure contract parameters
- Regular security audits
- Regulatory compliance

## Technical Architecture

### Blockchain Infrastructure
**Platform**: Ethereum/Polygon with Layer-2 optimization

**Smart Contracts**:
- Asset Tokenization Contract (ERC-721/ERC-1155)
- Marketplace Contract
- Escrow System

**Standards**:
- ERC-721 for unique assets
- ERC-1155 for fractionalized assets

### Frontend Architecture
**Framework**: 
- React.js with TypeScript
- TailwindCSS for responsive design
- Web3.js for blockchain interaction

**Features**:
- Asset marketplace dashboard
- Portfolio management
- Transaction history

### Backend Services
**Core Components**:
- Node.js/Express API server
- IPFS for decentralized storage

**Data Management**:
- MongoDB for market data
- Redis for caching

##  Solution

RWAHub introduces a full-stack tokenization protocol that enables:

- Asset verification and tokenization  
- Fractional ownership via blockchain tokens  
- Compliance-controlled transfers  
- Smart contract-based escrow settlement  
- Secondary marketplace trading  

Each token is backed by a verified real-world asset with enforceable compliance rules.

---

##  System Architecture

```txt
User Wallet
   │
Frontend (React / Web3)
   │
Backend API (Node.js)
   │
────────────────────────────
│                          │
KYC / AML           Blockchain Layer
│                   (Ethereum / Polygon)
│                          │
Compliance Engine   Smart Contracts
│                          │
───────────────┬────────────
               │
        Indexer Service
               │
     Off-chain State DB (MongoDB)
               │
           IPFS Storage
```

## Use Cases

### Real Estate
- Property tokenization
- Fractional ownership
- Automated rental distributions

### Luxury Goods
- Digital ownership certificates
- Transparent pricing
- Secure transfers

### Art & Collectibles
- Provenance tracking
- Fractional trading
- Portfolio management

## Roadmap

### Phase 1: Core Platform
- Smart contract deployment
- Basic marketplace features
- User authentication

### Phase 2: Enhanced Features
- Multi-chain support
- Advanced trading features
- Improved UI/UX

### Phase 3: Market Expansion
- Additional asset classes
- Enhanced security features
- Mobile application

### Phase 4: Ecosystem Growth
- Community governance
- Partnership integrations
- Market analytics




