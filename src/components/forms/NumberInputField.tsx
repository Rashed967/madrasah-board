import { Input } from "../ui/input";
import { Label } from "../ui/label";


  const NumberInputField = ({ label, name, value, onChange, type = "number", error,}) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            className={error ? "border-red-500" : ""}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);


export default NumberInputField