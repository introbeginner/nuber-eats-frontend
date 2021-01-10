import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { client } from "../../apollo";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input:$input){
      ok
      error
    }
  }
`

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: {ok}
    } = data;
    if(ok && userData){
      const {
        me:{ email: prevEmail, id},
      } = userData;
      const {email:newEmail} = getValues();
      if( prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment:gql`
          fragment EditedUser on User {
            verified
            email
          }
          `,
          data: {
            email: newEmail,
            verified:false,
          }
        })
      }
    }

  }
  const [editProfile, {loading}] = useMutation<editProfile,editProfileVariables>(EDIT_PROFILE_MUTATION,
    {
      onCompleted,
    });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>(
    {
      mode:"onChange",
      defaultValues:{
      email:userData?.me.email
    }}
  );
  const onSubmit = () => {
    const {email, password} = getValues();
    editProfile({
      variables:{
        input:{
          email,
          ...(password !== "" && {password}),
        }
      }
    })
  }
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Number Eate</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-3">
        <input ref={register({
          pattern: /^[a-zA-Z][a-zA-Z0-9]+@{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,4}$/
        })
        } name="email" className="input" type="email" placeholder="Email" />
        <input ref={register} name="passwod"className="input" type="password" placeholder="Password" />
        <Button loading={loading} canClick={formState.isValid} actionText="Save Profile" />
      </form>
    </div>
  )
}