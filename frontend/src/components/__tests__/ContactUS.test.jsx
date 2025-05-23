import { render, screen } from "@testing-library/react";
import { test, expect , describe , it} from "vitest";
import ContactUs from "../ContactUs";

describe("Testing contactUs page " ,  () =>{

  it("ContactUS should load", () => {
    render(<ContactUs />);
  
    const heading = screen.getByRole("button");
    expect(heading).to.exist; // ✅ Chai matcher alternative
  });
  
  
  test("ContactUS should load button", () => {
    render(<ContactUs />);
  
    const button = screen.getByRole("heading");
    expect(button).to.exist; // ✅ Chai matcher alternative
  });
  
  
  test("ContactUS should load input", () => {
    render(<ContactUs />);
  
    const button = screen.getAllByRole("textbox");
    expect(button).to.exist; // ✅ Chai matcher alternative
  });
  
  

})
// test("ContactUS should load input", () => {
//   render(<ContactUs />);

//   const button = screen.("name");
//   expect(button).to.exist; // ✅ Chai matcher alternative
// });
