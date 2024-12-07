import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useHookFormMask } from "use-mask-input";
import { FieldValues, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export default function Form() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {
        handleSubmit,
        register,
        setValue,
        setError,
        formState: { isSubmitting, errors },
    } = useForm();

    const registerWithMask = useHookFormMask(register);

    async function handleZipCodeBlur(e: React.FocusEvent<HTMLInputElement>
    ) {
        const zipcode = e.target.value;
        const res = await fetch(`https://brasilapi.com.br/api/cep/v2/{cep}${zipcode}`)
        if (res.ok) {
            const data = await res.json()
            setValue('address', data.street);
            setValue('city', data.city);
        }
    };

    async function onSubmit(data: FieldValues) {
        console.log("Form submitted");
        console.log(data);

        const res = await fetch('https://apis.codante.io/api/register-user/register', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (!res.ok) {
            for (const field in resData.errors){
                setError(field, {type: 'manual', message: resData.errors[field]})
            }
        }else{
            console.log
        }
        console.log(resData);
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="name">Nome Completo</label>
                <input type="text" id="name" {...register('name', {
                    required: 'Este campo nome precisa ser preenchido',
                    maxLength: {
                        value: 255,
                        message: "O nome deve ter no maximo 255 caracteres",
                    },
                })} />
                <p className="mt-1 text-xs text-red-400">
                    <ErrorMessage errors={errors} name="name" />
                </p>
            </div>
            <div className="mb-4">
                <label htmlFor="email">E-mail</label>
                <input className="" type="email" id="email" {...register('email', {
                    required: 'Este campo email precisa ser preenchido',
                    pattern: {
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: "E-mail Ivalido"
                    }
                })} />
                <p className="mt-1 text-xs text-red-400">
                    <ErrorMessage errors={errors} name="email" />
                </p>
            </div>

            <div className="mb-4">
                <label htmlFor="password">Senha</label>
                <div className="relative">
                    <input type={isPasswordVisible ? 'text' : 'password'} id="password" {...register('password', {
                        required: "O campo senha precisa ser preenchido",
                        minLength: {
                            value: 8,
                            message: "A senha deve ter no minímo 6 caracteres"
                        }
                    })} />
                    <p className="mt-1 text-xs text-red-400">
                        <ErrorMessage errors={errors} name="password" />
                    </p>
                    <span className="absolute right-3 top-3">
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? (
                                <EyeIcon size={20} className="cursor-pointer text-slate-600" />
                            ) : (
                                <EyeOffIcon
                                    size={20}
                                    className="cursor-pointer text-slate-600"
                                />
                            )}

                        </button>
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="confirm-password">Confirmar Senha</label>
                <div className="relative">
                    <input type={isPasswordVisible ? 'text' : 'password'} id="confirm-password"
                        {...register("password_confirmation", {
                            required: "A confirmação de senha precisa ser preenchida",
                            minLength: {
                                value: 8,
                                message: "A senha deve ter no mínimo 6 caracteres",
                            },
                            validate: {value: (value, formValues) =>{
                                if(value === formValues.password) return true;
                                return "As senhas devem coincidir";
                            }},
                        })} />
                    <p className="mt-1 text-xs text-red-400">
                        <ErrorMessage errors={errors} name="password_confirmation" />
                    </p>

                    <span className="absolute right-3 top-3">
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? (
                                <EyeIcon size={20} className="cursor-pointer text-slate-600" />
                            ) : (
                                <EyeOffIcon
                                    size={20}
                                    className="cursor-pointer text-slate-600"
                                />
                            )}

                        </button>
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="phone">Telefone Celular</label>
                <input type="text" id="phone"
                    {...registerWithMask("phone", "(99) 99999-9999", {
                        required: "O campo celular precisa ser preenchido",
                        pattern: {
                            value: /^\(\d{2}\) \d{5}-\d{4}$/,
                            message: "Telefone invalido"
                        }
                    })} />
                <p className="mt-1 text-xs text-red-400">
                    <ErrorMessage errors={errors} name="phone" />
                </p>

            </div>
            <div className="mb-4">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf"
                    {...registerWithMask("cpf", "999.999.999-99", {
                        required: "O campo CPF precisa ser preenchido",
                        pattern: {
                            value: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
                            message: "CPF invalido"
                        }
                    })} />
                <p className="mt-1 text-xs text-red-400">
                    <ErrorMessage errors={errors} name="cpf" />
                </p>
            </div>
            <div className="mb-4">
                <label htmlFor="cep">CEP</label>
                <input type="text" id="cep" {...registerWithMask("zipcode", "99999-999", {
                    required: "O campo CEP precisa ser preenchido",
                    pattern: {
                        value: /^\d{5}-\d{3}$/,
                        message: "CEP inválido",
                    },
                    onBlur: handleZipCodeBlur,
                })}
                />
                <p className="mt-1 text-xs text-red-400">
                    <ErrorMessage errors={errors} name="zipcode" />
                </p>
            </div>
            <div className="mb-4">
                <label htmlFor="address">Endereço</label>
                <input
                    className="disabled:bg-slate-200"
                    type="text"
                    id="address"
                    disabled
                    {...register("address")}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="city">Cidade</label>
                <input
                    className="disabled:bg-slate-200"
                    type="text"
                    id="city"
                    disabled
                    {...register("city")}
                />
                {/* termos e condicoes do input */}
                <div className="mb-4">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mr-2 accent-slate-500"
                        {...register("terms", {
                            required: "Os termos e condições devem ser aceitos",
                        })}
                    />
                    <label className="text-sm font-light text-slate-500 mb-1 inline" htmlFor="terms">
                        Aceito os {''}
                        <span className="underline hover:text-slate-900 cursor-pointer">
                            termos e condições
                        </span>
                    </label>
                    <p className="mt-1 text-xs text-red-400">
                        <ErrorMessage errors={errors} name="terms" />
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-500 font-semibold text-white w-full 
                rounded-xl p-3  hover:bg-slate-600 transition-colors disabled:bg-slate-300 flex items-center justify-center"
            >
                {isSubmitting ? (
                    <Loader className="animate-spin" />
                ) : (
                    'Cadastrar'
                )}
            </button>
        </form>
    )
}