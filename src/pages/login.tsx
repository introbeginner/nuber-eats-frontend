import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from '../images/logo.svg';
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import {Helmet} from "react-helmet-async"
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constant";


const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;



interface ILoginForm {
  email: string;
  password: string;
  resultError?: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit, formState } = useForm<ILoginForm>({ mode: "onChange" });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN,token);
      authToken(token);
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Number Eate</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className='w-52 mb-5' />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3"
        >
          <input
            ref={register({
              required: "Email is required",
              pattern: /^[a-zA-Z][a-zA-Z0-9]+@{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,4}$/
            })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type =="pattern" && (
            <FormError errorMessage={"Please enter a vaild email"} />
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
          
          <Button canClick={formState.isValid} loading={loading} actionText={"Log in"} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?
          <Link to='/create-account' className=" text-lime-600 hover:underline">
            Create an Account
            </Link>
        </div>
      </div>
    </div>

  )
};