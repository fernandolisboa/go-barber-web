import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { FiPower, FiClock } from 'react-icons/fi';

import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  formattedHour: string;
  customer: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const handleDateChange = useCallback(
    (day: Date, modifiers: DayModifiers) =>
      modifiers.available && !modifiers.disabled && setSelectedDate(day),
    [],
  );

  const handleMonthChange = useCallback(
    (month: Date) => setCurrentMonth(month),
    [],
  );

  useEffect(() => {
    api
      .get<IMonthAvailabilityItem[]>(
        `/providers/${user.id}/month-availability`,
        {
          params: {
            month: currentMonth.getMonth() + 1,
            year: currentMonth.getFullYear(),
          },
        },
      )
      .then(({ data }) => setMonthAvailability(data));
  }, [currentMonth, user.id]);

  const disabledDays = useMemo(() => {
    const disabledDates = monthAvailability
      .filter(({ available }) => !available)
      .map(({ day }) => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();

        return new Date(year, month, day);
      });

    return disabledDates;
  }, [currentMonth, monthAvailability]);

  const selectedDayAsText = useMemo(
    () => format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR }),
    [selectedDate],
  );

  const selectedWeekDay = useMemo(
    () => format(selectedDate, 'cccc', { locale: ptBR }),
    [selectedDate],
  );

  useEffect(() => {
    api
      .get<IAppointment[]>('/appointments/me', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(({ data }) => {
        const formattedAppointments = data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(formattedAppointments);
      });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(({ date }) => parseISO(date).getHours() < 12);
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(({ date }) => parseISO(date).getHours() >= 2);
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(({ date }) => isAfter(parseISO(date), new Date()));
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>

          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDayAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Próximo atendimento</strong>

              <Appointment>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>

                <div>
                  <img
                    src={nextAppointment.customer.avatar_url}
                    alt={nextAppointment.customer.name}
                  />

                  <strong>{nextAppointment.customer.name}</strong>
                </div>
              </Appointment>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {morningAppointments.map(
              ({ id, formattedHour, customer: { name, avatar_url } }) => (
                <Appointment key={id}>
                  <span>
                    <FiClock />
                    {formattedHour}
                  </span>

                  <div>
                    <img src={avatar_url} alt={name} />

                    <strong>{name}</strong>
                  </div>
                </Appointment>
              ),
            )}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {afternoonAppointments.map(
              ({ id, formattedHour, customer: { name, avatar_url } }) => (
                <Appointment key={id}>
                  <span>
                    <FiClock />
                    {formattedHour}
                  </span>

                  <div>
                    <img src={avatar_url} alt={name} />

                    <strong>{name}</strong>
                  </div>
                </Appointment>
              ),
            )}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
