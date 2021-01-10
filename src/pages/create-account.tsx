import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from '../images/logo.svg';
import { Helmet } from "react-helmet-async";
import { UserRole } from "../__generated__/globalTypes";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";


const CREAT_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(
      input: $createAccountInput
      ) {
      ok
      error
    }
  }
`;



interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    }
  });

  const history = useHistory()

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account Created!! Log in now!");
      history.push("/");
    }
  }
  const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREAT_ACCOUNT_MUTATION, { onCompleted });
  const onSubmit = () => {
    const { email, password, role } = getValues();
    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role }
        }
      })
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Creat Account | Number Eate</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className='w-52 mb-10' alt="Nuber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get start!</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3"
        >
          <input
            ref={register({ required: "Email is required" })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <select name="role" ref={register({ required: true })} className="input focus:bg-gray-200">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"Create Account"} />
        </form>
        {createAccountMutationResult?.createAccount.error && (
          <FormError errorMessage={createAccountMutationResult.createAccount.error} />)}
        <div>
          Already have an account ?{" "}
          <Link to='/' className=" text-lime-600 hover:underline">
            Log in now
            </Link>
        </div>
      </div>
    </div>

  )
};