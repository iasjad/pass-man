import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import './manager.css';
import { supabase } from '../utils/supabaseClient';
import { encryptData, decryptData } from '../utils/encryption';

const Manager = () => {
  const [form, setForm] = useState({ site: '', userName: '', password: '' });
  const [showPasswordInTable, setShowPasswordInTable] = useState({});

  const [passwordArry, setPasswordArry] = useState([]);
  const ref = useRef();
  const passwordRef = useRef();

  const showPassword = () => {
    if (ref.current.src.includes('icons/eye-slash-regular.svg')) {
      ref.current.src = 'icons/eye-solid.svg';
      passwordRef.current.type = 'password';
    } else {
      ref.current.src = 'icons/eye-slash-regular.svg';
      passwordRef.current.type = 'text';
    }
  };

  const toggleTablePassword = (id) => {
    setShowPasswordInTable((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyText = (text, part) => {
    toast.success(`${part} copied to the clipboard`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    navigator.clipboard.writeText(text);
  };

  const getPassword = async () => {
    let { data: passwords, error } = await supabase
      .from('passwords')
      .select('*');
    if (error) {
      console.error('Error fetching passwords:', error);
      toast.error('Could not fetch passwords.');
    } else if (passwords) {
      const decryptedPasswords = passwords.map((item) => ({
        ...item,
        password: decryptData(item.password),
      }));
      setPasswordArry(decryptedPasswords);
    }
  };

  useEffect(() => {
    getPassword();
  }, []);

  const savePassword = async () => {
    if (
      form.site.length < 4 ||
      form.userName.length < 4 ||
      form.password.length < 4
    ) {
      toast.error('All fields must be at least 4 characters long');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to save a password.');
      return;
    }

    const encryptedPassword = encryptData(form.password);

    let resultError = null;
    if (form.id) {
      const { error } = await supabase
        .from('passwords')
        .update({
          site: form.site,
          userName: form.userName,
          password: encryptedPassword,
        })
        .eq('id', form.id)
        .eq('user_id', user.id);
      resultError = error;
      if (!error) toast.success('Password Updated Successfully!');
    } else {
      const newPassword = {
        id: uuidv4(),
        user_id: user.id,
        site: form.site,
        userName: form.userName,
        password: encryptedPassword,
      };
      const { error } = await supabase.from('passwords').insert(newPassword);
      resultError = error;
      if (!error) toast.success('Password Saved Successfully!');
    }

    if (resultError) {
      console.error('Error saving password:', resultError);
      toast.error('Failed to save password.');
    }

    setForm({ site: '', userName: '', password: '' });
    await getPassword();
  };

  const deletePassword = async (id, part) => {
    let ok = confirm('Do you really want to delete this record?');
    if (ok) {
      const { error } = await supabase.from('passwords').delete().eq('id', id);

      if (error) {
        console.error('Error deleting password:', error);
        toast.error('Failed to delete password.');
      } else {
        toast.success(`${part} data deleted`);
        setPasswordArry(passwordArry.filter((item) => item.id !== id));
      }
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArry.find((i) => i.id === id);
    if (passwordToEdit) {
      setForm(passwordToEdit);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-sky-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className=" p-2 md:p-0 md:mycontainer md:pt-10 ">
        <h1 className="text-4xl font-bold text-center ">
          <span className="text-blue-800">Pass</span>
          <span className="text-red-800">Man</span>
          <span className="text-yellow-400">&#x26BF;</span>
        </h1>
        <p className="text-gray-900 text-lg text-center">
          Save your Passwords Just like{' '}
          <span className="text-blue-900">Super</span>
          <span className="text-red-900">Man</span>!!
        </p>
        <div className="text-black flex flex-col p-4 gap-3 items-center">
          <input
            onChange={handleChange}
            className="rounded-full border border-blue-500 w-full p-4 py-1 "
            type="text"
            name="site"
            id="site"
            placeholder="Enter Website's URL"
            value={form.site}
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              onChange={handleChange}
              className="rounded-full border border-blue-500 w-full p-4 py-1 "
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter Username"
              value={form.userName}
            />
            <div className="relative">
              <input
                ref={passwordRef}
                onChange={handleChange}
                className="rounded-full border border-blue-500 w-full p-4 py-1 "
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={form.password}
              />
              <span
                className="absolute right-[1px] top-[3px] cursor-pointer"
                onClick={() => showPassword()}
              >
                <img
                  ref={ref}
                  width={30}
                  className="p-1"
                  src="icons/eye-solid.svg"
                  alt="Showing password icon"
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="font-bold flex justify-center px-4 py-1 items-center bg-blue-500 gap-1 border hover:gap-2 border-blue-700 text-white rounded-full w-fit hover:bg-blue-600 hover:px-5 transition-all duration-200"
          >
            {' '}
            <lord-icon
              src="https://cdn.lordicon.com/sbnjyzil.json"
              trigger="click"
              state="hover-swirl"
              colors="primary:#FFFFFF,secondary:#FFFFFF"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords pb-10">
          <h2 className="font-bold text-2xl py-4">Saved Passwords</h2>
          {passwordArry.length === 0 && <div>No Record Found</div>}
          {passwordArry.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-1">Site</th>
                  <th className="py-1">Username</th>
                  <th className="py-1">Password</th>
                  <th className="py-1">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-blue-100 ">
                {passwordArry.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center  py-1 border border-white ">
                        <div className="flex justify-center items-center">
                          <a
                            href={
                              item.site.startsWith('http')
                                ? item.site
                                : `https://${item.site}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{item.site}</span>
                          </a>
                          <div
                            className="cursor-pointer size-7 copy-icon"
                            onClick={() => {
                              copyText(item.site, 'Site');
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/xuoapdes.json"
                              trigger="click"
                              colors="primary:#000000,secondary:#3b82f6"
                              style={{
                                paddingLeft: '2px',
                                width: '25px',
                                height: '25px',
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-1 border border-white">
                        <div className="flex items-center justify-center ">
                          <span>{item.userName}</span>
                          <div
                            className="cursor-pointer size-7 copy-icon"
                            onClick={() => {
                              copyText(item.userName, 'Username');
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/xuoapdes.json"
                              trigger="click"
                              colors="primary:#000000,secondary:#3b82f6"
                              style={{
                                paddingLeft: '2px',
                                width: '25px',
                                height: '25px',
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-1 border border-white">
                        <div className="flex relative items-center justify-center">
                          <div className="password-text-wrapper">
                            <span
                              className={`password-char ${
                                !showPasswordInTable[item.id]
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              }`}
                            >
                              {'•'.repeat(item.password.length)}
                            </span>
                            <span
                              className={`password-char ${
                                showPasswordInTable[item.id]
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              }`}
                            >
                              {item.password}
                            </span>
                          </div>
                          <div className="cursor-pointer size-7 copy-icon">
                            <lord-icon
                              onClick={() => {
                                copyText(item.password, 'Password');
                              }}
                              src="https://cdn.lordicon.com/xuoapdes.json"
                              trigger="click"
                              colors="primary:#000000,secondary:#3b82f6"
                              style={{
                                paddingLeft: '2px',
                                width: '25px',
                                height: '25px',
                              }}
                            ></lord-icon>
                            <span
                              className="absolute cursor-pointer "
                              onClick={() => toggleTablePassword(item.id)}
                            >
                              <img
                                ref={ref}
                                width={30}
                                className="p-1"
                                src={
                                  showPasswordInTable[item.id]
                                    ? 'icons/eye-slash-regular.svg'
                                    : 'icons/eye-solid.svg'
                                }
                                style={{ width: '25px', height: '25px' }}
                                alt="Toggle Password Visibility"
                              />
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-1 border border-white">
                        <div className="flex items-center justify-center">
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => editPassword(item.id)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/exymduqj.json"
                              trigger="hover"
                              colors="primary:#000000,secondary:#3b82f6"
                              style={{ width: '25px', height: '25px' }}
                            ></lord-icon>
                          </span>
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => deletePassword(item.id, item.site)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/xyfswyxf.json"
                              trigger="hover"
                              colors="primary:#000000,secondary:#3b82f6"
                              style={{ width: '25px', height: '25px' }}
                            ></lord-icon>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
