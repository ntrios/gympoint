import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { end_date, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Parabéns, Você está Matriculado !!!',
      template: 'welcome',
      context: {
        student: student.name,
        plan: plan.title,
        price: parseFloat(plan.price).toFixed(2),
        end_date: format(parseISO(end_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new WelcomeMail();
