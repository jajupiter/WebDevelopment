'use client'
import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

export default function Home() {
    const [address, setAddress] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signInWithEthereum = async () => {
        try {
            // ① Conectar MetaMask
            if (!window.ethereum) throw new Error("MetaMask no está instalado");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const nonceResponse = await fetch("http://localhost:3000/api/auth/message", {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify({ address, provider }),
                headers: { 'Content-Type': 'app/json' }

            });

            const res = await nonceResponse.json();

            const domain = window.location.host;
            const message = `
                    ${domain} wants you to sign in with your Ethereum account:
                    ${address}

                    Version: 1
                    Chain ID: 1
                    Token: ${res.token}
                    Issued At: ${new Date().toISOString()}
                    `;


            const signature = await signer.signMessage(message);


            const verifyRes = await fetch("http://localhost:3001/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message, signature })
            });

            if (!verifyRes.ok) throw new Error("Firma inválida");

            const result = await verifyRes.json();
            console.log(result)
            setAddress(result.address);
            setIsLoggedIn(true);

        } catch (err: any) {
            alert(err.message);
        }
    };

    const getSessionInfo = async () => {
        const res = await fetch("http://localhost:3001/me", { credentials: "include" });
        const data = await res.json();
        alert(JSON.stringify(data, null, 2));
    };

    const prueba = async () => {
        // ① Conectar MetaMask
        if (!window.ethereum) throw new Error("MetaMask no está instalado");
        const provider = new ethers.BrowserProvider(window.ethereum);

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const domain = window.location.host;
        const uri = window.location.origin


        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // ② Pedir nonce al servidor
        const nonceResponse = await fetch("http://localhost:3000/api/auth/message", {
            method: 'POST',
            body: JSON.stringify({ address }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });

        const response = await nonceResponse.json();

        const message = new SiweMessage({
            domain,
            address,
            statement: 'Sign in to the app',
            uri,
            version: "1",
            chainId: 1,
            nonce: response.token,
            issuedAt: new Date().toISOString()
        })


        const signature = await signer.signMessage(message.prepareMessage());

        const verifyRes = await fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ message, signature })
        });

        if (!verifyRes.ok) throw new Error("Firma inválida");

        const result = await verifyRes.json();
        console.log(result)
        setAddress(result.address);
        setIsLoggedIn(true);
    }

    return (
        <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
            <h1 className="p-2">🦊 Sign-In With Ethereum (SIWE)</h1>
            {!isLoggedIn ? (
                <>
                    <button onClick={signInWithEthereum} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">Conectar y firmar</button>
                    <button onClick={prueba} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">pruebita</button></>
            ) : (
                <>
                    <p>✅ Conectado como: {address}</p>
                    <button onClick={getSessionInfo}>Ver sesión</button>
                </>
            )}
        </div>
    );
}
