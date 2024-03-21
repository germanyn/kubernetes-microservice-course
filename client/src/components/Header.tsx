import React from 'react'
import Link from 'next/link'

interface Props {
    currentUser?: any | null
}

type LinkConfig = {
    label: string
    href: string
}

const Header = ({ currentUser }: Props) => {
    const linkConfigs: LinkConfig [] = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sell Ticket', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ]
    const links = linkConfigs
        .filter(linkConfig => !!linkConfig)
        .map(({ label, href }) =>(
            <li
                key={href}
                className='nav-item'
            >
                <Link href={href}>
                    <a className='nav-link'>{label}</a>
                </Link>
            </li>
        ))

    return (
        <nav className='navbar navbar-light bg-light'>
            <Link href="/">
                <a className='navbar-brand'>GitTix</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex">
                    {links}
                </ul>
            </div>
        </nav>
    )
}

export default Header
