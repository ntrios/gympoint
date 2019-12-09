import Mail from '../../lib/Mail';

class AnswerStudentMail {
  get key() {
    return 'AnswerStudentMail';
  }

  async handle({ data }) {
    const { student, question } = data;

    await Mail.transporter.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Gympoint: Respondendo sua pergunta...',
      template: 'answerStudent',
      context: {
        student: student.name,
        question: question.question,
        answer: question.answer,
      },
    });
  }
}

export default new AnswerStudentMail();
