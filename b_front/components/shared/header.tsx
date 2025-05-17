import { cn } from '@/lib/utils';
import { ArrowRight, AudioLines, Mic, ShoppingBasket, User } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Container } from './container';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {

    return (
        <header className={cn('border border-b', className)}>
            <Container className="flex items-center justify-between py-8">

                {/* Left Side*/}
                <div className='flex items-center gap-3 px-3'>
                    <Mic width={40} height={40} />
                    <div>
                        <h1 className="text-2xl uppercase font-black">VoiceBuy</h1>
                        <p className="text-sm text-gray-400 leading-3">Озвуч свой проект</p>
                    </div>
                </div>

                {/* Right Side*/}
                <div className='flex items-center gap-3 px-3'>
                    <div>
                        <Button variant="outline" className='flex items-center gap-2'>
                            <AudioLines width={20} height={20} />
                            <h3 className="text-m uppercase font-black">Заказать озвучку </h3>
                        </Button>
                    </div>
                    <div>
                        <Button className='group relative'>
                            <div className='flex items-center gap-1 transition duration-300 group-hover:opacity-0'>
                                <ShoppingBasket className='h-4 w-4 relative' strokeWidth={2}></ShoppingBasket>
                                <b>3</b> 
                            </div>
                            <ArrowRight size={20}
                                className='w-5 absolute right-5 transition duration-300 
                                -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'/>
                        </Button>

                    </div>
                    <div>
                        <Button className='flex items-center gap-2'>
                            <User width={20} height={20} />
                            <h3 className="text-m uppercase font-black">Войти</h3>
                        </Button>
                    </div>

                </div>


            </Container>
        </header>
    );
};