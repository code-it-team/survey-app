export const MINLEN = 3;
export const MAXLEN = 50;

// #########################      Survey      #########################
export const QUESTION_COLOR_TEXT = "text-success";
export const QUESTION_BTN_COLOR = "success";
export const CHOICE_COLOR_TEXT = "text-info";
export const CHOICE_BTN_COLOR = "info";
export const INITIAL_SURVEY = {
  name: "Survey Name",
  questions: [
    {
      body: "Question",
      choices: [{ body: "choice" }, { body: "choice" }],
    },
  ],
  published: null,
};

export const MIN_CHOICES = 2;
export const MAX_CHOICES = 8;
export const LE_SYMBOL = "\u2264";
export const GE_SYMBOL = "\u2265";

// ###########################    Errors   ##############################
export const INITIAL_ERRORS = {
  name: "",
  questions: [
    {
      body: "",
      choices: [{ body: "" }, { body: "" }],
    },
  ],
  post_survey: "",
};
