interface FormFieldProps {
  label: string;
  name: string;
}

interface FormProps {
  fields: FormFieldProps[];
  action?: string;
  method: string;
  submitText: string;
  inputType: string;
}

export default function Form(props: FormProps) {
  return (
    <form className="flex flex-col m-1" action={props.action ?? ""} method={props.method}>
      {props.fields.map(field => (
        <div className="m-1 flex flex-col">
          {field.label}
          <input type={props.inputType} className="text-black" name={field.name} />
        </div>
      ))}
      <button className="bg-neutral-200 text-md text-black flex justify-center rounded-md w-min whitespace-nowrap p-2 m-1 self-end">
        {props.submitText}
      </button>
    </form>
  );
}
