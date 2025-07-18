"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { getFinalPrice } from "@/utils/product-utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALGERIAN_WILAYAS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import {
  createOrder,
  type CreateOrderInput,
} from "../admin/dashboard/orders/actions";
import { useAction } from "next-safe-action/hooks";
import { getProductDetailWithSlug } from "../data/products-data";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  phone: z.string().regex(/^(0)(5|6|7)[0-9]{8}$/, {
    message: "Veuillez entrer un numéro de téléphone valide.",
  }),
  wilaya: z.string({
    required_error: "Veuillez sélectionner une wilaya.",
  }),
  address: z.string().min(10, {
    message: "L'adresse doit contenir au moins 10 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ConfirmOrderFormProps {
  initialProduct?: Awaited<ReturnType<typeof getProductDetailWithSlug>> | null;
}

export function ConfirmOrderForm({ initialProduct }: ConfirmOrderFormProps) {
  const router = useRouter();
  const { items, getTotal, clearCart, isLoading } = useCart();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      wilaya: "",
      address: "",
    },
  });

  const { execute, status } = useAction(createOrder, {
    onExecute: () => {
      toast({
        title: "Traitement en cours",
        description:
          "Veuillez patienter pendant que nous traitons votre commande...",
      });
    },
    onSuccess: (d) => {
      if (!initialProduct) {
        clearCart();
      }
      toast({
        title: "Succès",
        description: "Votre commande a été créée avec succès.",
      });
      const orderId = d.data?.data?.orderId ?? "";
      router.push(
        `/order-success?total=${orderTotal}&&items=${
          orderItems.length
        }&&wilaya=${form.getValues().wilaya}&&address=${
          form.getValues().address
        }&&phone=${form.getValues().phone}&&firstName=${
          form.getValues().firstName
        }&&lastName=${form.getValues().lastName}&&orderId=${orderId}`
      );
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    },
  });

  const orderItems = initialProduct ? [{ item: initialProduct, qt: 1 }] : items;

  const orderTotal = initialProduct
    ? getFinalPrice(initialProduct.price, initialProduct.discount)
    : getTotal();

  async function onSubmit(values: FormValues) {
    const orderData: CreateOrderInput = {
      ...values,
      totalAmount: orderTotal,
      items: orderItems.map((item) => ({
        productId: item.item.id,
        quantity: item.qt,
        price: getFinalPrice(item.item.price, item.item.discount),
      })),
    };
    await execute(orderData);
  }
  if (isLoading) return <></>;

  if (
    !initialProduct &&
    !isLoading &&
    items.length == 0 &&
    status != "hasSucceeded" &&
    status != "executing"
  ) {
    console.log(initialProduct);
    console.log(items.length);
    console.log("redircting redirect");
    router.replace("/cart");
    return <></>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre numéro de téléphone"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Format: 05XXXXXXXX, 06XXXXXXXX, ou 07XXXXXXXX
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wilaya"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wilaya</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre wilaya" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALGERIAN_WILAYAS.map((wilaya) => (
                      <SelectItem key={wilaya} value={wilaya}>
                        {wilaya}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de livraison</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrez votre adresse de livraison"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">{orderTotal} DA</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Méthode de paiement</span>
                <span>Paiement à la livraison</span>
              </div>
              {orderItems.map((item) => (
                <div
                  key={item.item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.item.name} × {item.qt}
                  </span>
                  <span>{item.item.price * item.qt} DA</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={status === "executing"}
          >
            {status === "executing"
              ? "Traitement en cours..."
              : "Confirmer la commande"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            En confirmant votre commande, vous acceptez nos conditions générales
            de vente.
          </p>
        </div>
      </form>
    </Form>
  );
}
