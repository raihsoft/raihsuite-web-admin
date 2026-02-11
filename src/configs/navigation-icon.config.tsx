import React from 'react'
import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiGridFourDuotone,
} from 'react-icons/pi'
import { LiaAddressBook } from "react-icons/lia";
import { LiaBandcamp } from "react-icons/lia";
import { CgBrowse } from "react-icons/cg";
import { BiPackage } from "react-icons/bi";
import { MdEvent } from "react-icons/md";
import { FiGrid } from "react-icons/fi";


import type { JSX } from 'react'
import { BsPersonCheck } from 'react-icons/bs';

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    dashboard: <FiGrid />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,

    // Additional mappings for navigation config keys
    usersIcon: <span><BsPersonCheck /></span>,
    contactsIcon:  <span><LiaBandcamp /></span>,
    boxIcon:  <span><LiaAddressBook /></span>,
    orderIcon: <span><BiPackage /></span>,
    eventsIcon: <span><MdEvent /></span>,
    employeesEdit: <span><CgBrowse /></span>,
}

export default navigationIcon
