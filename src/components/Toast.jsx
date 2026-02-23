import { useEffect, useState } from "react";

const Toast = ({ message, onDone }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fadeOut = setTimeout(() => setVisible(false), 2200);
        const remove = setTimeout(onDone, 2550);
        return () => { clearTimeout(fadeOut); clearTimeout(remove); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={`toast ${visible ? "toast-show" : "toast-hide"}`}>
            <span className="toast-check">✓</span> {message}
        </div>
    );
};

export default Toast;
