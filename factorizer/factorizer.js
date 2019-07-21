function getPrime(maxNum) {
  sieve = new Array(maxNum + 1);
  sieve.fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let prime = 2; prime * prime <= maxNum; prime++) {
    if (!sieve[prime]) continue;
    for (let composite = prime * prime; composite <= maxNum; composite += prime) sieve[composite] = false;
  }

  primes = new Array;
  for (const [idx, value] of sieve.entries()) if (value) primes.push(idx);

  return primes;
}

$(document).ready(function () {
  const primeSet = getPrime(10000);
  function factorize(n) {
    if (n == 0) return [[0, 1]];
    else if (n == 1) return [[1, 1]];

    result = new Array();
    for (const prime of primeSet) {
      let power = 0;
      for (; n % prime === 0; n /= prime) power++;
      if (power !== 0) result.push([prime, power]);
    }
    if (n != 1) result.push([n, 1]);

    return result;
  }

  let resApp = new Vue({
    el: '#resContainer',
    data: {
      number: 0
    },
    computed: {
      factorizedResult: function () {
        let ret = new String();
        const factors = factorize(this.number);
        for (let i = 0; i < factors.length; i++) {
          let [prime, power] = factors[i];
          ret += prime.toString()
          if (power != 1) ret += ('<sup>' + power.toString() + '</sup>')
          ret += ' × '
        }

        return ret.slice(0, -3);
      }
    }
  });

  let btnApp = new Vue({
    el: '#btnContainer',
    methods: {
      input: function (code) {
        if (code == 11) {
          resApp.number = 0;
          return;
        }

        if (resApp.number === 0) {
          if (!(code == 0 || code == 10))
            resApp.number = code;
        }
        else {
          if (code == 10) {
            if (resApp.number.toString().length === 1) resApp.number = 0;
            else resApp.number = parseInt(resApp.number.toString().slice(0, -1));
          }
          else if (resApp.number.toString().length <= 7) {
            resApp.number = parseInt(resApp.number.toString() + code.toString());
          }
        }

        return;
      }
    }
  });

  $(this).keydown(function (e) {
    e.preventDefault();
    if (48 <= e.keyCode && e.keyCode < 58) btnApp.input(e.keyCode - 48);
    if (e.keyCode == 8) btnApp.input(10);
  });
});