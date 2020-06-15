import withAuth from "graphql-auth";

export default (pubsub: any) => ({
  Query: {
    // async quiz(obj, {id}, {Quiz}) {
    //   const quiz = await Quiz.getQuiz(id);
    //   // console.log('user profile', userProfile);

    //   if (quiz) {
    //     return null;
    //   }

    //   return quiz;
    // },
    async quizzes(obj: any, { filter }: any, context: any) {
      return context.Quiz.getQuizzes(filter);
    },

    async quiz(obj: any, { id }: any, context: any) {
      return context.Quiz.getQuiz(id);
    },
    async quizWithAnswers(obj: any, { id, userId }: any, context: any) {
      const quiz = await context.Quiz.getQuizWithAnswersByUser(id, userId);
      console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqq', quiz);
      return quiz;
    },
    async answer(obj: any, { input }: any, context: any) {
      return context.Quiz.getAnswerByParams(input);
    },
    async answers(obj: any, { userId, quizId }: any, context: any) {
      const quiz = await context.Quiz.getQuiz(quizId);
      let questionIdArray = [];
      quiz && quiz.questions.map((question, key) => {
        questionIdArray.push(question.id);
      });
      console.log("ggggg", questionIdArray);
      let resultsArray = [];
      const params = { userId: userId, questionIdArray: questionIdArray };
      const result = await context.Quiz.getAnswersByParams(params);
      console.log("ggggggggggggg", result);

      return {
        answers: result,
      };
    },
    async getAttendees(obj: any, { id }: any, context: any) {
      const quiz = await context.Quiz.getQuiz(id);
      let questionIdArray = [];
      quiz.questions.map((question, key) => {
        questionIdArray.push(question.id);
      });
      console.log("ggggg", questionIdArray);

      const params = { questionIdArray: questionIdArray };
      const result = await context.Quiz.getAnswersByQuestionArray(params);
      console.log("ggggggggggggg", result);
      let userIdArray = [];
      result.map((item, key) => {
        const found = userIdArray.find((id) => id === item.userId);
        console.log("found", found);
        if (!found || (found && found.length === 0)) {
          userIdArray.push(item.userId);
        }
      });
      console.log("userIddd", userIdArray);
      const users = context.User.getUsersWithIdArray(userIdArray);
      console.log("usersss", users);
      return {
        users: users,
      };
    },
    async getUserWiseResult(obj: any, { id }: any, context: any) {
      const quiz = await context.Quiz.getQuizWithAnswers(id);

      let questionIdArray = [];
      quiz.questions.map((question, key) => {
        questionIdArray.push(question.id);
      });
      console.log("ggggg", questionIdArray);

      const params = { questionIdArray: questionIdArray };
      const result = await context.Quiz.getAnswersByQuestionArray(params);
      console.log("ggggggggggggg", result);
      let userIdArray = [];
      result.map((item, key) => {
        const found = userIdArray.find((id) => id === item.userId);
        console.log("found", found);
        if (!found || (found && found.length === 0)) {
          userIdArray.push(item.userId);
        }
      });
      console.log("userIddd", userIdArray);
      const users = await context.User.getUsersWithIdArray(userIdArray);
      console.log("usersss", users);
      let quizOut = {
        id: quiz.id,
        userId: quiz.userId,
        questions: quiz.questions,
        attendees: {users:users},
      };
      // quizOut.questions &&
      //   quizOut.questions.length !== 0 &&
      //   quizOut.questions.map((question, key1) => {
      //     question.results= [];
      //     result.map((re, key) => {
      //       if (re.questionId === question.id) {
      //         question.results.push(re);
      //       }
      //       quiz.questions[key1].question = question;
      //       console.log('result pushed', quiz.questions[key1].results);
      //     });
      //   });
        console.log('quizOut', quizOut);
      return quizOut;
    },
    async getQuizCount(obj: any, { id }: any, context: any) {
      try {
        let quiz = await context.Quiz.getQuiz(id);
        let choiceIdArray = [];
        quiz.questions &&
          quiz.questions.length !== 0 &&
          quiz.questions.map((question, key1) => {
            question.choices &&
              question.choices.length !== 0 &&
              question.choices.map((choice, key2) => {
                choiceIdArray.push(choice.id);
                quiz.questions[key1].choices[key2].count = 0;
              });
          });

        const params = { choiceIdArray: choiceIdArray };
        const result = await context.Quiz.getAnswersByChoiceArray(params);
        console.log(result);
        quiz.questions &&
          quiz.questions.length !== 0 &&
          quiz.questions.map((question, key1) => {
            question.choices &&
              question.choices.length !== 0 &&
              question.choices.map((choice, key2) => {
                var choiceCount = 0;
                result.map((re, key) => {
                  if (re.choiceId === choice.id) {
                    choiceCount += 1;
                  }
                });
                quiz.questions[key1].choices[key2].count = choiceCount;
              });
          });
        return quiz;
      } catch (e) {
        return null;
      }
    },
  },
  Mutation: {
    async addQuiz(obj: any, { input }: any, { Quiz }: any) {
      console.log("input in res", input);
      const id = await Quiz.addQuiz(input);
      console.log("quiz added", id);
      const newQuiz = await Quiz.getQuiz(id);
      console.log("neee", newQuiz);
      // const quiz = await Quiz.getQuiz(id);
      // console.log('user profile', userProfile);

      if (id) {
        return newQuiz;
      } else {
        return null;
      }
    },
    deleteQuiz: withAuth(async (obj: any, { id }: any, { Quiz }: any) => {
      try {
        const data = await Quiz.getQuiz(id);
        await Quiz.deleteQuiz(id);
        // pubsub.publish(BLOGS_SUBSCRIPTION, {
        //   blogsUpdated: {
        //     mutation: 'DELETED',
        //     node: data
        //   }
        // });
        return data;
      } catch (e) {
        return e;
      }
    }),
    editQuiz: withAuth(async (obj: any, { input }: any, { Quiz }: any) => {
      try {
        const inputId = input.id;
        console.log("quiz edit resolvers1", input);

        // if (input.authorId) {
        //   input.authorId = await Profile.getProfileId(input.authorId);
        // }
        // delete input.id;
        // delete input.tags;
        const isDeleted = await Quiz.editQuiz(input);
        const item = await Quiz.getQuiz(inputId);
        // pubsub.publish(BLOGS_SUBSCRIPTION, {
        //   blogsUpdated: {
        //     mutation: 'UPDATED',
        //     node: item
        //   }
        // });
        return item;
      } catch (e) {
        return e;
      }
    }),
    async addAnswers(obj: any, { input }: any, { Quiz }: any) {
      try {
        input.results.map(async (result, item) => {
          const ansExists = await Quiz.getAnswerByParams(result);
          console.log("ansexists", ansExists);
          var isDone;
          const questionItem = await Quiz.getQuestion(result.questionId);
          console.log("question existss", questionItem);
          if (ansExists && ansExists.length !== 0) {
            isDone = await Quiz.updateAnswer(result);
          } else {
            isDone = await Quiz.addAnswer(result);
          }
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    async addAnswer(obj: any, { input }: any, { Quiz }: any) {
      console.log("input in res", input);
      const ansExists = await Quiz.getAnswerByParams(input);
      console.log("ansexists", ansExists);
      var isDone;
      const questionItem = await Quiz.getQuestion(input.questionId);
      console.log("question existss", questionItem);
      var questionHasChoice = false;
      questionItem.map((item, key) => {
        if (item.id === input.choiceId) {
          questionHasChoice = true;
        }
      });
      if (!questionHasChoice) {
        return null;
      }
      if (ansExists && ansExists.length !== 0) {
        isDone = await Quiz.updateAnswer(input);
      } else {
        isDone = await Quiz.addAnswer(input);
      }
      console.log("ansexists123", isDone);

      const newAnswer = await Quiz.getAnswerByParams(input);
      console.log("ansexists123444", newAnswer);

      // const isAdded = Quiz.addQuiz(input);
      // console.log('quiz added', isAdded);

      // const quiz = await Quiz.getQuiz(id);
      // console.log('user profile', userProfile);

      if (isDone) {
        return newAnswer[0];
      } else {
        return null;
      }
    },
  },
  Subscription: {},
});
