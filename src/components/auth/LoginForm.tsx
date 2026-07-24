"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/lib/loginValidation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {signIn} from "next-auth/react"
import { useRouter } from "next/navigation";

export function LoginForm(){
    const router = useRouter();
    const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "",
        password: "",
    }
});
  

  async function onSubmit(values: LoginSchema){
      const result = await signIn("credentials", {
         email: values.email,
         password: values.password,
         redirect: false,
      })
      
      if (!result) {
             form.setError("root", {
      message: "Something went wrong",
    });
    return;
          }
          if (result.error) {
    form.setError("root", {
      message: "Invalid email or password",
    });
    return;
  }
      if (result.ok){
        form.reset();
      router.push("/dashboard");
      router.refresh();
      }
   }

   return (
    <Form {...form}>
        <form className="space-y-4 w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} autoComplete = "email" onChange={(e)=>{
                    field.onChange(e);
                    form.clearErrors("root");
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} autoComplete="current-password" onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors("root");
                    }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-red-500">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
    </Form>
 )}



