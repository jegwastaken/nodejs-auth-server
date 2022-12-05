function post(form: HTMLFormElement, formAction = '') {
    fetch(formAction, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new FormData(form)),
    })
        .then(async(res) => {
            const data = await res.json();

            if(!res.ok) {
                console.error('res err:', data);

                throw new Error(`${res.status} (${res.statusText})`);
            }

            console.log('data:', data);
        })
        .catch((err) => console.error('err', err));
}

const signUpForm = document.getElementById('sign-up-form');

if(signUpForm instanceof HTMLFormElement) {
    signUpForm.onsubmit = function onsubmit(e) {
        e.preventDefault();

        post(signUpForm, signUpForm.dataset.action);
    };
}

const newClientForm = document.getElementById('new-client-form');

if(newClientForm instanceof HTMLFormElement) {
    newClientForm.onsubmit = function onsubmit(e) {
        e.preventDefault();

        post(newClientForm, newClientForm.dataset.action);
    };
}

//
// TODO: For testing only. Delete these lines.
//
if(signUpForm) {
    // const a = Math.round(Math.random() * 1000);
    // const b = Math.round(Math.random() * 1000);
    // const rand = `${a}${b}`;
    // document.getElementById('new-email').value = `test${rand}@test.com`;
    // document.getElementById('new-username').value = `test${rand}`;
    ((document.getElementById('new-email') as HTMLFormElement) ?? {}).value
        = 'test@test.com';
    ((document.getElementById('new-username') as HTMLFormElement) ?? {}).value
        = 'test';
    ((document.getElementById('new-password') as HTMLFormElement) ?? {}).value
        = 'test';
}

//
// TODO: For testing only. Delete these lines.
//
if(newClientForm) {
    // const a = Math.round(Math.random() * 1000);
    // const b = Math.round(Math.random() * 1000);
    // const rand = `${a}${b}`;
    // document.getElementById('new-email').value = `test${rand}@test.com`;
    // document.getElementById('new-username').value = `test${rand}`;
    ((document.getElementById('new-clientID') as HTMLFormElement) ?? {}).value
        = 'toitnupsweb';
    (
        (document.getElementById('new-clientname') as HTMLFormElement) ?? {}
    ).value = 'Toit Nups Web';
    (
        (document.getElementById('new-clientsecret') as HTMLFormElement) ?? {}
    ).value = '87FeY7Rjea!f@#';
    (
        (document.getElementById('new-redirectURI') as HTMLFormElement) ?? {}
    ).value = 'http://localhost:3000';
}
