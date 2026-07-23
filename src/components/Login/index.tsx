import React, { useState } from 'react';
import styles from './Login.module.css';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [isCadastro, setIsCadastro] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      if (isCadastro) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
    } catch (err: any) {
      setErro('Erro na autenticação: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {isCadastro ? 'Criar Conta 🏋️' : 'Entrar no App 🔑'}
      </h2>
      
      <form onSubmit={handleAuth} className={styles.form}>
        <input 
          type="email" 
          placeholder="Seu e-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className={styles.input}
          required 
        />
        <input 
          type="password" 
          placeholder="Sua senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          className={styles.input}
          required 
        />
        <button type="submit" className={styles.button}>
          {isCadastro ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      {erro && <p className={styles.error}>{erro}</p>}

      <p 
        onClick={() => setIsCadastro(!isCadastro)} 
        className={styles.toggleText}
      >
        {isCadastro ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar-se'}
      </p>
    </div>
  );
};