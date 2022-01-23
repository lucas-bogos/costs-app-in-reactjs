import { useState, useEffect } from 'react'
import styles from './Message.module.css'

export const Message = ({ type, msg }) => {
    const [visible, setVisible] = useState(false)
    const timeOfShowMessage = 3500;

    useEffect(() => {
        if(!msg){
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, timeOfShowMessage)
        
        return () => clearTimeout(timer)
    }, [msg])

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
                )
            }
        </>
    )
}