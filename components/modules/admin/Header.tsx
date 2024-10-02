"use client";
import clsx from "clsx";
import React, { useState } from "react";
import MobileButtonOpen from "./MobileButtonOpen";
import DarkModeSwitcher from "./DarkModeSwitcher";
import UserDropdown from "./UserDropdown";
import Row from "../custom/Row";
import Container from "../custom/Container";

const Header = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <header
      className={clsx(
        "relative top-0 z-10 h-[80px] flex items-center bg-white shadow-sm w-full",
        "dark:bg-dark"
      )}
    >
      <Container>
        <Row className="justify-between">
          {/* left section  */}
          <div>
            {/* Mobile sidebar icon  */}
            <MobileButtonOpen
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />

            {/* Search input  */}
            {/* <SearchInput /> */}
          </div>

          {/* Right section  */}
          <div className="relative flex items-center justify-end gap-8">
            {/* dark change mode  */}
            <DarkModeSwitcher />

            {/* User notifications  */}
            {/* <UserAlerts /> */}

            {/* User dropdown  */}
            <UserDropdown />
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
