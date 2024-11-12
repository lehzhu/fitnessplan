import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "db/schema";
import { useUser } from "../hooks/use-user";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register } = useUser();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: any, isLogin: boolean) => {
    const result = isLogin ? await login(data) : await register(data);
    
    if (result.ok) {
      toast({
        title: "Success!",
        description: isLogin ? "Logged in successfully" : "Account created successfully",
      });
      setLocation("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Start managing your workout plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TabsContent value="login">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => onSubmit(form.getValues(), true)}
                  >
                    Login
                  </Button>
                </TabsContent>

                <TabsContent value="register">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => onSubmit(form.getValues(), false)}
                  >
                    Register
                  </Button>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
