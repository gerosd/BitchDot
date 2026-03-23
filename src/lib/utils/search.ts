const EN_TO_RU: Record<string, string> = {
    q:'й',w:'ц',e:'у',r:'к',t:'е',y:'н',u:'г',i:'ш',o:'щ',p:'з',
    '[':'х',']':'ъ',a:'ф',s:'ы',d:'в',f:'а',g:'п',h:'р',j:'о',k:'л',
    l:'д',';':'ж',"'":'э',z:'я',x:'ч',c:'с',v:'м',b:'и',n:'т',m:'ь',
    ',':'б','.':'ю','`':'ё',
};

const RU_TO_EN: Record<string, string> = Object.fromEntries(
    Object.entries(EN_TO_RU).map(([en, ru]) => [ru, en])
);

/** Конвертирует строку в альтернативную раскладку */
export function convertLayout(str: string): string {
    const lower = str.toLowerCase();
    // Определяем, латиница это или кириллица
    const isLatin = /[a-z]/.test(lower);
    const map = isLatin ? EN_TO_RU : RU_TO_EN;
    return lower.split('').map(ch => map[ch] ?? ch).join('');
}

/** Расстояние Левенштейна */
export function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
}

/**
 * Проверяет, подходит ли название товара под поисковый запрос.
 * Учитывает: точное вхождение, нечёткое совпадение слов, конвертацию раскладки.
 */
export function matchesSearch(productName: string, rawQuery: string): boolean {
    const name = productName.toLowerCase();
    const query = rawQuery.toLowerCase().trim();
    const queryConverted = convertLayout(query);

    // Для каждого варианта запроса (оригинал и конвертированная раскладка)
    for (const q of [query, queryConverted]) {
        if (!q) continue;

        // 1. Точное вхождение подстроки
        if (name.includes(q)) return true;

        // 2. Нечёткий поиск: разбиваем запрос и название на слова
        const queryWords = q.split(/\s+/).filter(Boolean);
        const nameWords = name.split(/\s+/).filter(Boolean);

        // Каждое слово запроса должно нечётко совпасть хотя бы с одним словом названия
        const allWordsMatch = queryWords.every(qWord => {
            // Допуск ошибок: 1 на каждые 4 символа (минимум 1)
            const tolerance = Math.max(1, Math.floor(qWord.length / 4));
            return nameWords.some(nWord => levenshtein(qWord, nWord) <= tolerance);
        });

        if (allWordsMatch) return true;
    }

    return false;
}