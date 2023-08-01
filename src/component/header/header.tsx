import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { linkList } from 'utils/links/links'
import { IoMdArrowDropdown } from 'react-icons/io'
import './header.css'

export default function Header() {

    useEffect(() => {
        const items: NodeListOf<HTMLDivElement> = document.querySelectorAll(".header__item");
        const user: HTMLDivElement | null = document.querySelector(".fullname");

        const elementArray: HTMLElement[] = Array.from(items);
        if (user instanceof HTMLElement) {
            elementArray.push(user);
        }

        elementArray.forEach(function (item) {
            item.addEventListener("mouseover", function (this: HTMLElement) {
                const listId: string | null = this.getAttribute("data-list");
                if (listId !== null) {
                    const list: HTMLElement | null = document.getElementById(listId);
                    if (list) {
                        list.classList.add("active");
                    }
                }
            });

            item.addEventListener("mouseout", function (this: HTMLElement) {
                const listId: string | null = this.getAttribute("data-list");
                if (listId !== null) {
                    const list: HTMLElement | null = document.getElementById(listId);
                    if (list) {
                        list.classList.remove("active");
                    }
                }
            });
        });
    }, []);

    return (
        <div id="header">
            <div className="header__layout">
                <a className="header__layout-brand" href="/home">
                    <img className="header__layout-logo" src="media/general/logo-light.svg" />
                </a>
                <ul className="header__group-items">
                    {linkList.map((item) => (
                        <li className="header__item" data-list={item.title}>
                            <div className="header__layout-left">
                                <span className='header-title'>
                                    {item.title}
                                </span>
                                <span className="arrow-icon header-title">
                                    {item.icon}
                                </span>
                                <div className="dropdown-item" id={item.title}>
                                    {item.dropdownList.map((element) => (
                                        <NavLink
                                            to={`/${element.link}`}
                                            key={element.link}
                                            className='nav-link'
                                        >
                                            <div className="item">
                                                <span className="item-name">
                                                    {element.link}
                                                </span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <ul className="header__layout-right">
                <li className="popup">
                    <span className="header-title">
                        USD
                    </span>
                    <span className="arrow-icon header-title">
                        <IoMdArrowDropdown style={{ fontSize: '24px' }} />
                    </span>
                </li>
                <div className='line'></div>
                <li className="popup">
                    <img className='lang' alt='lang' src='media/general/lang.png' />
                    <span className="header-title">
                        United Kingdom
                    </span>
                    <span className="arrow-icon header-title">
                        <IoMdArrowDropdown style={{ fontSize: '24px' }} />
                    </span>
                </li>
                <button className='header-button'>
                    <span className="header-title">
                        Become An Expert
                    </span>
                </button>
                <button className='header-button dark'>
                    <span className="header-title">
                        Sign In / Register
                    </span>
                </button>
            </ul>
        </div>
    )
}
