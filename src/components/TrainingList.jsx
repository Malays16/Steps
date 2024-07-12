import { useState } from 'react';

const isValidDate = date => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/;
  return dateRegex.test(date);
};

const TrainingList = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    date: '',
    distance: '',
    isEditing: false,
    error: ''
  });

  const handleChange = evt => {
    const { name, value } = evt.target;
    setForm(form => ({
      ...form,
      [name]: value,
      error: name === 'date' && value.length && !isValidDate(value) ? 'Неверный формат даты' : ''
    }));
  };

  const saveTraining = evt => {
    evt.preventDefault();
    if (!form.date || !form.distance || form.distance <= 0 || !isValidDate(form.date)) return;


    setList(list => {
      let updatedList;
      const existDate = list.find(training => training.date === form.date);

      if (form.isEditing) {
        updatedList = list.map(training => {
          if (training.date === form.date) {
            return {
              ...training,
              distance: parseFloat(form.distance).toFixed(1)
            };
          } else {
            return training;
          }
        });
      } else if (existDate) {
        updatedList = list.map(training => {
          if (training.date === form.date) {
            return {
              ...training,
              distance: (parseFloat(training.distance) + parseFloat(form.distance)).toFixed(1)
            };
          } else {
            return training;
          }
        });
      } else {
        updatedList = [...list, { date: form.date, distance: parseFloat(form.distance).toFixed(1) }];
      }

      updatedList.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB - dateA;
      });

      return updatedList;
    });

    setForm({ date: '', distance: '', error: '', isEditing: false });
  };

  const editTraining = date => {
    const trainingExist = list.find(training => training.date === date);
    if (trainingExist) {
      setForm({
        date: trainingExist.date,
        distance: trainingExist.distance,
        isEditing: true,
        error: ''
      });
    }
  };

  return (
    <>
      <form>
        <label htmlFor="date">
          Дата (ДД.ММ.ГГ)
          <input id="date" type="text" name="date" value={form.date} disabled={form.isEditing} onChange={handleChange} />
          {form.error && <div className="error">{form.error}</div>}
        </label>
        <label htmlFor="distance">
          Пройдено км
          <input id="distance" type="number" step="0.1" name="distance" value={form.distance} onChange={handleChange} />
        </label>
        <button id="add" onClick={saveTraining} disabled={!form.date || !form.distance || form.distance <= 0 || !isValidDate(form.date)}>
          Ok
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Дата (ДД.ММ.ГГ)</th>
            <th>Пройдено км</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {list.map((training, index) => (
            <tr key={index}>
              <td>{training?.date}</td>
              <td>{training?.distance}</td>
              <td>
                <button id="edit" onClick={() => editTraining(training.date)}>
                  ✎
                </button>
                <button id="delete" onClick={() => setList(list.filter(item => item.date !== training.date))}>
                  ✘
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TrainingList;