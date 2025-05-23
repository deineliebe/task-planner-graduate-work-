// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
import { FC, SyntheticEvent, useRef, useState } from 'react';
import addTaskStyles from './addNewTaskForm.module.css';
import formStyles from '../../../shared/ui/form.module.css';
import buttonStyles from '../../../shared/ui/button.module.css';
import styles from '../../../shared/ui/styles.module.css';
import { useDispatch } from '@/shared/lib/store/store';
import {
	addTask,
	addUserTask,
	getLastTask
} from '@/shared/lib/store/slices/tasks';
import { TNewTask } from '@/shared/model/types';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

type AddNewFormProps = {
	setShowModal: (showModal: boolean) => void;
	userId: number | null;
};

const AddNewFormUI: FC<AddNewFormProps> = ({ setShowModal, userId }) => {
	const onStatusClick = (evt: React.MouseEvent) => {
		document.body
			.querySelector(`.${formStyles['form-button-in-bar-active']}`)
			?.classList.add(`${buttonStyles.buttonCommon}`);
		document.body
			.querySelector(`.${formStyles['form-button-in-bar-active']}`)
			?.classList.add(`${styles.isClicked}`);
		document.body
			.querySelector(`.${formStyles['form-button-in-bar-active']}`)
			?.classList.remove(`${formStyles['form-button-in-bar-active']}`);
		(evt?.target as HTMLElement)?.classList?.add(
			`${formStyles['form-button-in-bar-active']}`
		);
		(evt?.target as HTMLElement)?.classList?.remove(
			`${buttonStyles.buttonCommon}`
		);
		(evt?.target as HTMLElement)?.classList?.remove(`${styles.isClicked}`);
	};
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState<Date | null>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		const name = nameRef.current?.value || '';
		const newTask: TNewTask = {
			name: name,
			description: descriptionRef.current?.value || null,
			deadline: startDate ? moment(startDate).add(3, 'h').toISOString() : null,
			status: (
				document.body.querySelector(
					`.${formStyles['form-button-in-bar-active']}`
				) as HTMLButtonElement
			)?.innerText,
			created_at: new Date()
		};
		await dispatch(addTask({ newTask })).unwrap();
		const lastTask: number = (await dispatch(getLastTask({ name })).unwrap())[0]
			.id;
		dispatch(addUserTask({ task_id: lastTask, user_id: userId || 0 }));
		setShowModal(false);
	};
	return (
		<>
			<form
				id='add-task'
				name='add-task'
				className={addTaskStyles['add-task']}
				onSubmit={handleSubmit}
			>
				<p
					className={`${formStyles['form-heading']} ${addTaskStyles['add-task-heading']}`}
				>
					Добавление задачи
				</p>
				<section
					className={`${formStyles['form-section']} ${addTaskStyles['add-task-section']}`}
				>
					<fieldset className={`${formStyles['form-field']}`}>
						<label
							className={`${formStyles['form-label']} ${addTaskStyles['add-task-label-required']}`}
							htmlFor='task_name'
						>
							Название{' '}
						</label>
						<input
							type='text'
							id='task_name'
							name='task_name'
							ref={nameRef}
							className={`${addTaskStyles['add-task-input']}`}
							required
						/>
					</fieldset>
					<fieldset className={`${formStyles['form-field']}`}>
						<label
							className={`${formStyles['form-label']}`}
							htmlFor='task_description'
						>
							Описание
						</label>
						<textarea
							id='task_description'
							name='task_description'
							ref={descriptionRef}
							className={`${addTaskStyles['add-task-input']}`}
						/>
					</fieldset>
					<fieldset className={`${formStyles['form-field']}`}>
						<label className={`${formStyles['form-label']}`} htmlFor='deadline'>
							Дедлайн
						</label>
						<DatePicker
							showIcon
							toggleCalendarOnIconClick
							selected={startDate}
							className={`${addTaskStyles['add-task-input']}`}
							onChange={(date) => setStartDate(date)}
						/>
					</fieldset>
					<fieldset className={`${formStyles['form-field']}`}>
						<label className={`${formStyles['form-label']}`} htmlFor='status'>
							Статус
						</label>
						<div id='status' className={`${formStyles['form-buttons-bar']}`}>
							<button
								type='button'
								className={`${formStyles['form-button-in-bar']} ${formStyles['form-button-in-bar-active']} ${buttonStyles.isShadowed}`}
								onClick={onStatusClick}
							>
								Бэклог
							</button>
							<button
								type='button'
								className={`${formStyles['form-button-in-bar']} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
								onClick={onStatusClick}
							>
								В работе
							</button>
							<button
								type='button'
								className={`${formStyles['form-button-in-bar']} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
								onClick={onStatusClick}
							>
								На проверке
							</button>
							<button
								type='button'
								className={`${formStyles['form-button-in-bar']} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
								onClick={onStatusClick}
							>
								В блоке
							</button>
							<button
								type='button'
								className={`${formStyles['form-button-in-bar']} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
								onClick={onStatusClick}
							>
								Готово
							</button>
						</div>
					</fieldset>
				</section>
				<div className={`${formStyles['form-footer']}`}>
					<input
						type='reset'
						className={`${buttonStyles.button} ${buttonStyles.buttonLarge} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
						value='Отмена'
						onClick={() => setShowModal(false)}
					/>
					<button
						type='submit'
						className={`${buttonStyles.button} ${buttonStyles.buttonLarge} ${buttonStyles.buttonCommon} ${buttonStyles.isShadowed} ${styles.isClicked}`}
					>
						Добавить
					</button>
				</div>
			</form>
		</>
	);
};

export default AddNewFormUI;
