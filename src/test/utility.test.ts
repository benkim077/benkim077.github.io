import { describe, test, expect } from "@jest/globals";
import getClassNameFromHtmlClassAttribute from "../utility/getClassNameFromHtmlAttribute";

describe("getClassNameFromHtmlClassAttribute", () => {
  test("Markdown Code Language Classes", () => {
    expect(
      getClassNameFromHtmlClassAttribute('class="html language-html"')
    ).toBe("html language-html");
  });

  test("Utility Classes", () => {
    expect(getClassNameFromHtmlClassAttribute('class="p-4 m-4 flex"')).toBe(
      "p-4 m-4 flex"
    );
  });

  test("Just a Class", () => {
    expect(getClassNameFromHtmlClassAttribute('class="unique"')).toBe("unique");
  });

  test("Empty Class", () => {
    expect(getClassNameFromHtmlClassAttribute('class=""')).toBe("");
  });

  // class attribute가 생략되는 경우, 이 함수를 사용하지 않는다. 그러므로 이런 테스트는 필요하지 않다.
  // test("Empty String", () => {
  //   expect(getClassNameFromHtmlClassAttribute("")).toBe("");
  // })
});
