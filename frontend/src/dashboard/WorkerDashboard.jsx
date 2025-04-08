import MyReservations from '../components/MyReservations';
import AvailabilityManager from '../components/AvailabilityManager';
import { useAuth } from '../context/AuthContext';


const WorkerDashboard = () => {
  const { user } = useAuth();

  console.log(user)
  console.log(user.role)

  return (
    <div>
      <h1>Panel del trabajador</h1>
      <MyReservations />
      <hr />
      <AvailabilityManager />
    </div>
  );
};

export default WorkerDashboard;
