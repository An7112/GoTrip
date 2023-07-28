
import {FaUserAlt, FaWallet, FaPiggyBank, FaFileAlt} from 'react-icons/fa'
import {IoMdArrowDropdown} from 'react-icons/io'

export const linkList = [
    {
        title: "Home",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Home 1'},
            {link: 'Home 1'},
            {link: 'Home 1'},
        ]
    },
    {
        title: "Categories",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Categories 1'},
            {link: 'Categories 1'},
            {link: 'Categories 1'},
        ]
    },
    {
        title: "Destinations",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Destinations 1'},
            {link: 'Destinations 1'},
            {link: 'Destinations 1'},
        ]
    },
    {
        title: "Blog",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Blog 1'},
            {link: 'Blog 1'},
            {link: 'Blog 1'},
        ]
    },
    {
        title: "Pages",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Pages 1'},
            {link: 'Pages 1'},
            {link: 'Pages 1'},
        ]
    },
    {
        title: "Dashboard",
        icon: <IoMdArrowDropdown style={{fontSize: '24px'}}/>,
        dropdownList: [
            {link: 'Dashboard 1'},
            {link: 'Dashboard 1'},
            {link: 'Dashboard 1'},
        ]
    },
]

export const userLink = [
    {
        link: "user-info/cashier",
        name: "CASHIER",
        icon: <FaWallet style={{fontSize:'24px'}}/>
    },
    {
        link: "user-info/rewards",
        name: "REWARDS",
        icon: <FaPiggyBank style={{fontSize:'24px'}}/>
    },
    {
        link: "user-info/profile",
        name: "PROFILE",
        icon: <FaUserAlt style={{fontSize:'24px'}}/>
    },
    {
        link: "user-info/history",
        name: "HISTORY",
        icon: <FaFileAlt style={{fontSize:'24px'}}/>
    },
]