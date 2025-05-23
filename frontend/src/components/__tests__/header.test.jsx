import { render, screen  , fireEvent} from "@testing-library/react";
import { test  , expect } from "vitest";
// import Fellow from "../FellowCommponents/Fellow";
// import  Chat from "../ChatSection/Chats";
// import CreatePost from "../post/CreatePost";
// import BookReview from "../BookReview/BookReview"
// import { MemoryRouter } from "react-router-dom";
import {store} from "../../redux/store/store";
import { BrowserRouter } from "react-router-dom";

import HeaderSection from "../HeaderSection";
import { Provider } from "react-redux";

test("header should be loaded" , () =>{

    render(
        <BrowserRouter>
        <Provider store={store}>
        <HeaderSection />
      
      </Provider>
      </BrowserRouter>)

    const header = screen.getByText("Express Reading");

    expect(header).to.exist;

})


test("click on Profile" , () =>{

    render(
        <BrowserRouter>
        <Provider store={store}>
        <HeaderSection />
      
      </Provider>
      </BrowserRouter>)

    const button = screen.getByRole("button" , {name : "Profile"});

    fireEvent.click(button)

    expect(button).to.exist;

})