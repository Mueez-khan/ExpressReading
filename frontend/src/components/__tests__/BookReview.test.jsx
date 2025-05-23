import { render, screen  , act, fireEvent  } from "@testing-library/react";
import { test, expect, vi  } from "vitest";
import  BookReview from "../BookReview/BookReview";
import MOCK_DATA from "./MOCK_DATA.json";
import { BrowserRouter } from "react-router-dom";

global.fetch = vi.fn(() =>{
    return Promise.resolve({
        json: () => {
            return Promise.resolve(MOCK_DATA)
        }
    })
})

test("Render bookReview" , async () =>{

    await act(async () => render(
        <BrowserRouter>
    <BookReview/>
    </BrowserRouter>)

    )

    const btn = screen.getByRole("button" ,  {name :  "searchButton"})

    // const searchInput = screen.getByPlaceholderText("Search reviews...")

    // fireEvent.change(searchInput , {target : { value : "very"}})
    // fireEvent.click(btn)


    // const cards = screen.getAllByTestId("reviewCard");

    expect(btn).to.exist;
    

})