"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e, _f, _g;
function post(form, formAction = '') {
    fetch(formAction, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new FormData(form)),
    })
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield res.json();
        if (!res.ok) {
            console.error('res err:', data);
            throw new Error(`${res.status} (${res.statusText})`);
        }
        console.log('data:', data);
    }))
        .catch((err) => console.error('err', err));
}
const signUpForm = document.getElementById('sign-up-form');
if (signUpForm instanceof HTMLFormElement) {
    signUpForm.onsubmit = function onsubmit(e) {
        e.preventDefault();
        post(signUpForm, signUpForm.dataset.action);
    };
}
const newClientForm = document.getElementById('new-client-form');
if (newClientForm instanceof HTMLFormElement) {
    newClientForm.onsubmit = function onsubmit(e) {
        e.preventDefault();
        post(newClientForm, newClientForm.dataset.action);
    };
}
//
// TODO: For testing only. Delete these lines.
//
if (signUpForm) {
    // const a = Math.round(Math.random() * 1000);
    // const b = Math.round(Math.random() * 1000);
    // const rand = `${a}${b}`;
    // document.getElementById('new-email').value = `test${rand}@test.com`;
    // document.getElementById('new-username').value = `test${rand}`;
    ((_a = document.getElementById('new-email')) !== null && _a !== void 0 ? _a : {}).value
        = 'test@test.com';
    ((_b = document.getElementById('new-username')) !== null && _b !== void 0 ? _b : {}).value
        = 'test';
    ((_c = document.getElementById('new-password')) !== null && _c !== void 0 ? _c : {}).value
        = 'test';
}
//
// TODO: For testing only. Delete these lines.
//
if (newClientForm) {
    // const a = Math.round(Math.random() * 1000);
    // const b = Math.round(Math.random() * 1000);
    // const rand = `${a}${b}`;
    // document.getElementById('new-email').value = `test${rand}@test.com`;
    // document.getElementById('new-username').value = `test${rand}`;
    ((_d = document.getElementById('new-clientID')) !== null && _d !== void 0 ? _d : {}).value
        = 'toitnupsweb';
    ((_e = document.getElementById('new-clientname')) !== null && _e !== void 0 ? _e : {}).value = 'Toit Nups Web';
    ((_f = document.getElementById('new-clientsecret')) !== null && _f !== void 0 ? _f : {}).value = '87FeY7Rjea!f@#';
    ((_g = document.getElementById('new-redirectURI')) !== null && _g !== void 0 ? _g : {}).value = 'http://localhost:3000';
}
//# sourceMappingURL=main.js.map