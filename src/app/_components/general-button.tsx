interface ButtonGeneralProps {
    label?: string;
    type?: "button" | "submit" | "reset" | undefined;
    children: React.ReactNode;
    onClick?: (e?: any) => void;
    className: string;
}

const ButtonGeneral = (props: ButtonGeneralProps) => {
    const { label, onClick, className, children } = props;
    return (
        <button
        type={props.type ?? "button"}
        className={`${className}`}
         onClick={onClick}>
        {label}
        {children}
        </button>
    );
    }

export default ButtonGeneral;

