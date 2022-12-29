import Head from 'next/head';
import { useRouter } from 'next/router';
import Currency from 'react-currency-formatter';

import Header from '../components/Header';
import Button from '../components/Button';
import CheckoutProduct from '../components/CheckoutProduct';

import { useSelector } from 'react-redux';
import { selectCartProducts, selectCartTotal } from '../redux/cartSlice';
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';

export default function Checkout() {
    const router = useRouter();

    const products = useSelector(selectCartProducts);
    const totalProducts = useSelector(selectCartTotal);

    const [loading, setLoading] = useState(false);
    const [groupedProductsInCart, setGroupedProductsInCart] = useState(
        {} as { [key: string]: Product[] }
    );

    useEffect(() => {
        const groupedProducts = products.reduce((results, product) => {
            (results[product._id] = results[product._id] || []).push(product);
            return results;
        }, {} as { [key: string]: Product[] });

        setGroupedProductsInCart(groupedProducts);
    }, [products]);

    const createCheckoutSession = async () => {
        setLoading(true);
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#e7ecee]">
            <Head>
                <title>Cart - Apple Store</title>
            </Head>

            <Header />
            <main className="mx-auto max-w-5xl pb-24">
                <div className="px-5">
                    <h2 className="lg: my-4 text-3xl font-semibold lg:text-4xl">
                        {products.length > 0
                            ? 'Revise seu Carrinho!'
                            : 'Seu Carrinho está vazio!'}
                    </h2>
                    <p className="my-4">Entregas e devoluções são gratuitas.</p>
                    {products.length === 0 && (
                        <Button
                            title="Continuar Comprando"
                            onClick={() => router.push('/')}
                        />
                    )}
                </div>
                {products.length > 0 && (
                    <div className="mx-5 md:mx-8">
                        {Object.entries(groupedProductsInCart).map(([key, products]) => (
                            <CheckoutProduct key={key} products={products} id={key} />
                        ))}
                        <div className="my-12 mt-6 ml-auto max-w-3xl">
                            <div className="divide-y divide-gray-300">
                                <div className="pb-4">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>
                                            <Currency
                                                quantity={totalProducts}
                                                currency="BRL"
                                            />
                                        </p>
                                    </div>
                                    <div>
                                        <p>Envio</p>
                                        <p>Grátis</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-x-1 lg:flex-row">
                                            Taxa estimada para:
                                            <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
                                                Digite seu CEP
                                                <ChevronDownIcon className="h-6 w-6" />
                                            </p>
                                        </div>
                                        <p>R$ -</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4 text-xl font-semibold">
                                    <h4>Total</h4>
                                    <h4>
                                        <Currency
                                            quantity={totalProducts}
                                            currency="BRL"
                                        />
                                    </h4>
                                </div>
                            </div>
                            <div className="my-14 space-y-4">
                                <h4 className="text-xl font-semibold">
                                    Como você gostaria de pagar?
                                </h4>
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="order-2 flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center">
                                        <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                            <span>Pague mensalmente</span>
                                            <span>Com o Cartão Apple</span>
                                            <span>
                                                <Currency
                                                    quantity={1415.16}
                                                    currency="BRL"
                                                />
                                                por mês à 0% de juros.
                                            </span>
                                        </h4>
                                        <Button title="Pague prestações mensais com o Cartão Apple" />
                                        <p className="mt-2 max-w-[240px] text-[13px]">
                                            R$0,00 com vencimento hoje, que inclui o preço
                                            total aplicável itens, adiantamentos, frete e
                                            impostos.
                                        </p>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                                        <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                            Pague integralmente
                                            <span>
                                                <Currency
                                                    quantity={totalProducts}
                                                    currency="BRL"
                                                />
                                            </span>
                                        </h4>
                                        <Button
                                            title="Pagar"
                                            width="w-full"
                                            noIcon
                                            loading={loading}
                                            onClick={createCheckoutSession}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
