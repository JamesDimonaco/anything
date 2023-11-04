interface ButtonGeneralProps {
    label: string;
    children: React.ReactNode;
    onClick: () => void;
    className: string;
}

const ButtonGeneral = (props: ButtonGeneralProps) => {
    const { label, onClick, className, children } = props;
    return (
        <button 
        
        className={`${className} max-w-4`}
         onClick={onClick}>
        {label}
        {children}
        </button>
    );
    }

export default ButtonGeneral;

