import Container from '@/components/ui/Container';

export default function AboutPage() {
    return (
        <div className="bg-base">
            <section className="relative h-screen flex items-center justify-center bg-surface">
                <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2600&auto=format&fit=crop"
                    alt="About BitchDot"
                    className="object-cover opacity-80 h-full absolute"
                />
                <div className="absolute h-full inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        О бренде BitchDot
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Научный подход к красоте с 2001 года
                    </p>
                </Container>
            </section>

            <section className="py-24">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-base-content mb-8">
                            Философия бренда
                        </h2>
                        <div className="prose prose-lg text-surface-content space-y-6">
                            <p>
                                Мы верим, что профессиональный уход должен быть доступен каждому. BitchDot сочетает в себе передовые технологии, высококачественное сырье из Европы и строгий контроль на каждом этапе производства.
                            </p>
                            <p>
                                Наша миссия — создавать продукты, которые не только маскируют несовершенства, но и решают проблемы изнутри. Каждое средство проходит дерматологический контроль и тестирование эффективности.
                            </p>
                            <p>
                                За долгие годы работы мы заслужили доверие миллионов покупателей и тысяч профессионалов в индустрии красоты. Мы гордимся тем, что производим косметику, которая действительно работает.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-24 bg-surface">
                <Container>
                    <h2 className="text-3xl font-bold text-center text-base-content mb-16">
                        Наши ценности
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Научный подход', desc: 'Собственная лаборатория и сотрудничество с ведущими европейскими институтами.', icon: '🧪' },
                            { title: 'Эффективность', desc: 'Рабочие концентрации активных компонентов в каждом флаконе.', icon: '✨' },
                            { title: 'Безопасность', desc: 'Не тестируется на животных. Строгий контроль качества.', icon: '🌿' }
                        ].map((item, i) => (
                            <div key={i} className="bg-base p-8 rounded-3xl shadow-sm border border-border text-center">
                                <div className="text-5xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-base-content mb-4">{item.title}</h3>
                                <p className="text-surface-content">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </div>
    );
}
