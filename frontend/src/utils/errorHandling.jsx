export const setErrorFromServer = (errors) => { 
  const errorss = {}; 
  if (errors.data) { 
      Object.keys(errors.data).forEach((key) => { 
          errorss[key] = errors.data[key]; 
      }); 
  } else { 
      errorss['message'] = errors.message; 
  }

  return errorss; 
}
