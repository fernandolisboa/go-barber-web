import React, { useState } from 'react';

import { FiPower, FiClock } from 'react-icons/fi';

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

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
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
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Próximo atendimento</strong>

            <div>
              <img
                src="https://avatars2.githubusercontent.com/u/6035851?s=460&u=eb0ef7936a77bdddc04ec3a818ba74164037a8a0&v=4"
                alt="Fernando Lisboa"
              />

              <strong>Fernando Lisboa</strong>

              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/6035851?s=460&u=eb0ef7936a77bdddc04ec3a818ba74164037a8a0&v=4"
                  alt="Fernando Lisboa"
                />

                <strong>Fernando Lisboa</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                10:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/6035851?s=460&u=eb0ef7936a77bdddc04ec3a818ba74164037a8a0&v=4"
                  alt="Macaco Albino"
                />

                <strong>Macaco Albino</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                11:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/6035851?s=460&u=eb0ef7936a77bdddc04ec3a818ba74164037a8a0&v=4"
                  alt="Luiz Gabriel"
                />

                <strong>Luiz Gabriel</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                15:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/6035851?s=460&u=eb0ef7936a77bdddc04ec3a818ba74164037a8a0&v=4"
                  alt="Pedro Miguel"
                />

                <strong>Pedro Miguel</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>

        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
