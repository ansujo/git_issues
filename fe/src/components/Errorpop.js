import React,{useEffect} from "react";

export default function Errorpop({message,onClose}){
    useEffect(()=>{
        if(message){
            const timer=setTimeout(()=>{
                onClose();
            },4000);
            return ()=> clearTimeout(timer);
        }
    },[message,onClose]);

    if(!message) return null;

    return(
        <div style={styles.toast}>
            <span style={styles.icon}>⚠️</span>
            <span style={styles.styles}>{message}</span>
            <button style={styles.close} onClick={onClose}>x</button>
        </div>
    );
}

const styles = {
  toast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#1a1a1a",
    border: "1px solid #90ee90",
    color: "white",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,255,100,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 9999,
    animation: "slideIn 0.3s ease-out",
  },
  icon: {
    fontSize: "1.2rem",
  },
  text: {
    flexGrow: 1,
    fontSize: "0.9rem",
  },
  close: {
    background: "transparent",
    border: "none",
    color: "#90ee90",
    fontSize: "1.2rem",
    cursor: "pointer",
    lineHeight: 1,
  },
};