-- Replace questions with richer set from JSON data files
-- Run this in Supabase SQL Editor

-- Clear existing questions
truncate table questions restart identity;

-- Insert all questions from JSON data files
insert into questions (category, text_en, text_fr, text_ar, order_index) values
-- === COMMUNICATION: Conflict Resolution ===
('communication', 'How do you prefer to handle disagreements — talk immediately or take space first?', 'Comment préférez-vous gérer les désaccords — en parler immédiatement ou prendre du recul d''abord ?', 'كيف تفضل التعامل مع الخلافات — التحدث فوراً أولاً أخذ مسافة؟', 1),
('communication', 'What''s your go-to response when you''re angry — talk it out, go silent, or walk away?', 'Quelle est votre réponse par défaut quand vous êtes en colère — en parler, vous taire, ou partir ?', 'ما هي استجابتك المعتادة عندما تغضب — التحدث، الصمت، أو المغادرة؟', 2),
('communication', 'What does a sincere apology look like to you?', 'À quoi ressemble une excuse sincère pour vous ?', 'كيف تبدو الاعتذار الصادق بالنسبة لك؟', 3),
('communication', 'When was the last time you felt truly heard by your partner?', 'Quand avez-vous été la dernière fois que vous vous êtes senti vraiment écouté par votre partenaire ?', 'متى شعرت آخر مرة أن شريكي يسمعني حقاً؟', 4),
('communication', 'What topics are hardest for us to discuss calmly?', 'Quels sujets sont les plus difficiles pour nous à discuter calmement ?', 'ما هي المواضيع الأصعب لنا أن نناقشها بهدوء؟', 5),
('communication', 'Do we try to understand each other, or just try to win the argument?', 'Essayons-nous de nous comprendre, ou juste de gagner l''argument ?', 'هل نحاول فهم بعضنا البعض، أم فقط محاولة الفوز بالجدل؟', 6),

-- === COMMUNICATION: Emotional Expression ===
('communication', 'How do you like to be comforted when you''re upset?', 'Comment aimez-vous être consolé quand vous êtes contrarié ?', 'كيف تحب أن تُواسى عندما تحزن؟', 7),
('communication', 'Do you feel comfortable telling your partner everything?', 'Vous sentez-vous à l''aise pour tout dire à votre partenaire ?', 'هل تشعر بالراحة في إخبار شريكي بكل شيء؟', 8),
('communication', 'What''s the best way your partner can show you they care?', 'Quelle est la meilleure façon pour votre partenaire de vous montrer qu''il s''en soucie ?', 'ما هي أفضل طريقة لشريكي لإظهار اهتمامه بي؟', 9),
('communication', 'Is there something that keeps you awake at night that you haven''t shared with me?', 'Y a-t-il quelque chose qui vous empêche de dormir la nuit et que vous n''avez pas partagé avec moi ?', 'هل هناك شيء يمنعك من النوم ليلة لم تشاركني به؟', 10),
('communication', 'When do you feel most loved by me?', 'Quand vous sentez-vous le plus aimé par moi ?', 'متى تشعر بالحب مني أكثر؟', 11),
('communication', 'What''s something you''ve been afraid to tell me?', 'Quelque chose que vous avez eu peur de me dire ?', 'ما هو شيء خفت من إخباري به؟', 12),

-- === VALUES: Religion & Spirituality ===
('values', 'How important is religion or spirituality in your life?', 'Quelle importance la religion ou la spiritualité a-t-elle dans votre vie ?', 'ما هي أهمية الدين أو الروحانية في حياتك؟', 13),
('values', 'Is it important that your partner shares your religious beliefs?', 'Est-il important que votre partenaire partage vos croyances religieuses ?', 'هل من المهم أن يشاركك شريكي معتقداتك الدينية؟', 14),
('values', 'How do we raise our children when it comes to religion or faith?', 'Comment élevons-nous nos enfants en matière de religion ou de foi ?', 'كيف نربي أطفالنا عندما يتعلق الأمر بالدين أو الإيمان؟', 15),
('values', 'Can you respect your partner''s beliefs even if they differ from yours?', 'Pouvez-vous respecter les croyances de votre partenaire même si elles diffèrent des vôtres ?', 'هل يمكنك احترام معتقدات شريكك حتى لو اختلفت عن معتقداتك؟', 16),
('values', 'Would it affect our relationship if your partner lost their faith?', 'Cela affecterait-il notre relation si votre partenaire perdait sa foi ?', 'هل سيؤثر ذلك على علاقتنا إذا فقد شريكك إيمانه؟', 17),

-- === VALUES: Life Goals ===
('values', 'Do you want to live in a big city or a small town?', 'Voulez-vous vivre dans une grande ville ou une petite ville ?', 'هل تريد العيش في مدينة كبيرة أم بلدة صغيرة؟', 18),
('values', 'What''s on your bucket list — things you want to do before you die?', 'Qu''y a-t-il sur votre liste de souhaits — choses que vous voulez faire avant de mourir ?', 'ما هو في قائمة أمنياتك — أشياء تريد فعلها قبل الموت؟', 19),
('values', 'Would you rather have a simple life or chase wealth and success?', 'Préféreriez-vous une vie simple ou poursuivre la richesse et le succès ?', 'هل تفضل حياة بسيطة أم السعي وراء الثروة والنجاح؟', 20),
('values', 'Where do you see us living in 10 years?', 'Où vous nous voyez vivre dans 10 ans ?', 'أين ترانا نعيش بعد 10 سنوات؟', 21),
('values', 'What does "a good life" mean to you — stability, adventure, achievement, or something else?', 'Que signifie "une bonne vie" pour vous — stabilité, aventure, accomplissement ou autre chose ?', 'ماذا تعني "الحياة الجيدة" بالنسبة لك — الاستقرار، المغامرة، الإنجاز، أو شيء آخر؟', 22),

-- === DAILY LIFE: Morning Routines ===
('lifestyle', 'Do you need alone time before starting the day?', 'Avez-vous besoin de temps seul avant de commencer la journée ?', 'هل تحتاج وقتاً وحيداً قبل أن تبدأ اليوم؟', 23),
('lifestyle', 'Should breakfast be eaten together or is it okay to eat separately?', 'Le petit-déjeuner devrait-il être pris ensemble ou est-il acceptable de manger séparément ?', 'هل يجب تناول الإفطار معاً أم يُقبل الأكل منفصلين؟', 24),
('lifestyle', 'Is checking your phone first thing in the morning okay?', 'Est-il acceptable de vérifier son téléphone dès le matin ?', 'هل من المقبول التحقق من الهاتف في الصباح الباكر؟', 25),

-- === DAILY LIFE: Chores & Responsibilities ===
('lifestyle', 'How should we split household chores?', 'Comment devrions-nous diviser les tâches ménagères ?', 'كيف يجب تقسيم الأعمال المنزلية؟', 26),
('lifestyle', 'Do you mind doing the dishes every night?', 'Ça vous dérange de faire la vaisselle chaque soir ?', 'هل يزعجك غسل الأطباق كل ليلة؟', 27),
('lifestyle', 'Would you rather hire help for cleaning than argue about chores?', 'Préféreriez-vous engager de l''aide pour le nettoyage plutôt que de se disputer pour les tâches ?', 'هل تفضل استئجار مساعدة للتنظيف بدلاً من الشجار على الأعمال المنزلية؟', 28),

-- === DAILY LIFE: Social Life ===
('lifestyle', 'Do you need to see your friends regularly, even if it means time apart?', 'Avez-vous besoin de voir vos amis régulièrement, même si cela signifie du temps séparé ?', 'هل تحتاج إلى رؤية أصدقائك بانتظام حتى لو كان ذلك يعني الوقت منفصلاً؟', 29),
('lifestyle', 'Should your partner''s friends become your friends too?', 'Les amis de votre partenaire devraient-ils devenir vos amis aussi ?', 'هل يجب أن يصبح أصدقاء شريكك أصدقائك أيضاً؟', 30),
('lifestyle', 'Is going out together more fun than staying in?', 'Sortir ensemble est-il plus amusant que rester à la maison ?', 'هل الخروج معاً أكثر متعة من البقاء في المنزل؟', 31),

-- === INTIMACY: Physical Affection ===
('intimacy', 'How important is physical affection (hugs, kisses, cuddling) to you?', 'Quelle importance l''affection physique (câlins, baisers, câlin) a-t-elle pour vous ?', 'ما هي أهمية العاطفة الجسدية (عناق، قبلات، تدلل) بالنسبة لك؟', 32),
('intimacy', 'How do you feel about public displays of affection?', 'Que pensez-vous des démonstrations publiques d''affection ?', 'ماذا تعتقد حول مظاهر الحب في الأماكن العامة؟', 33),
('intimacy', 'How has your physical intimacy changed since we got together?', 'Comment votre intimité physique a-t-elle changé depuis que nous sommes ensemble ?', 'كيف تغيرت علاقتنا الجسدية منذ أن أصبحنا معاً؟', 34),
('intimacy', 'Do you feel loved when I show physical affection?', 'Vous sentez-vous aimé quand je montre de l''affection physique ?', 'هل تشعر بالحب عندما أظهر العاطفة الجسدية؟', 35),
('intimacy', 'If our physical intimacy declined, would you feel rejected?', 'Si notre intimité physique diminuait, vous sentiriez-vous rejeté ?', 'إذا انخفضت علاقتنا الجسدية، هل ستشعر بالرفض؟', 36),

-- === INTIMACY: Quality Time ===
('intimacy', 'Do you enjoy just hanging out with me, even when we''re not doing anything special?', 'Aimez-vous juste traîner avec moi, même quand nous ne faisons rien de spécial ?', 'هل تستمتع بقضاء الوقت معي حتى لو لم نفعل شيئاً مميزاً؟', 37),
('intimacy', 'How often should we have date nights?', 'À quelle fréquence devrions-nous avoir des soirées en couple ?', 'كم مرة يجب أن نقضي ليالي مواعدة؟', 38),
('intimacy', 'Do you need more alone time than I do?', 'Avez-vous besoin de plus de temps seul que moi ?', 'هل تحتاج إلى وقت وحيد أكثر مني؟', 39),
('intimacy', 'What''s your favorite thing to do together?', 'Quelle est votre activité préférée à faire ensemble ?', 'ما هو نشاطك المفضل للقيام به معاً؟', 40),
('intimacy', 'If we stopped doing things together, would our relationship suffer?', 'Si nous arrêtions de faire des choses ensemble, notre relation en souffrirait-elle ?', 'إذا توقفنا عن القيام بأشياء معاً، هل ستتأثر علاقتنا؟', 41),

-- === FINANCES: Spending Habits ===
('finances', 'Are you a spender or a saver?', 'Êtes-vous dépensier ou économe ?', 'هل أنت منفق أم مدخر؟', 42),
('finances', 'How much can you spend without checking in with your partner first?', 'Combien pouvez-vous dépenser sans d''abord consulter votre partenaire ?', 'كم يمكنك إنفاقه دون استشارة شريكك أولاً؟', 43),
('finances', 'What''s the biggest financial mistake you''ve made?', 'Quelle est la plus grande erreur financière que vous ayez commise ?', 'ما هو أكبر خطأ مالي ارتكبته؟', 44),
('finances', 'Do you think buying experiences is more important than buying things?', 'Pensez-vous qu''acheter des expériences est plus important que d''acheter des choses ?', 'هل تعتقد أن شراء التجارب أهم من شراء الأشياء؟', 45),
('finances', 'What money habit of mine would bother you most if it never changed?', 'Quelle habitude d''argent la mienne vous dérangerait le plus si elle ne changeait jamais ?', 'أي عادة مالية خاصة بي ستعك أكثر إذا لم تتغير أبداً؟', 46),

-- === FINANCES: Financial Transparency ===
('finances', 'Should we combine all our finances or keep some separate?', 'Devrions-nous combiner toutes nos finances ou en garder certaines séparées ?', 'هل يجب أن نجمع كل أموالنا أو نحتفظ ببعضها منفصلة؟', 47),
('finances', 'How transparent should partners be about their income and debts?', 'Les partenaires devraient-ils être transparents sur leurs revenus et dettes ?', 'كم يجب أن يكون الشريكان شفافين بشأن دخلهما وديونهما؟', 48),
('finances', 'If one partner earns much more, how should we split costs?', 'Si un partenaire gagne beaucoup plus, comment devrions-nous diviser les coûts ?', 'إذا كان أحد الشريكين يكسب أكثر بكثير، كيف نقسم التكاليف؟', 49),
('finances', 'What does financial security mean to you?', 'Que signifie la sécurité financière pour vous ?', 'ماذا تعني الأمن المالي بالنسبة لك؟', 50),
('finances', 'How do we handle it if one of us loses income for six months?', 'Comment gérons-nous si l''un de nous perd son revenu pendant six mois ?', 'كيف نتعامل إذا فقد أحدنا دخله لمدة ستة أشهر؟', 51),

-- === CHILDREN: Family Planning ===
('children', 'Do you want to have children someday?', 'Voulez-vous avoir des enfants un jour ?', 'هل تريد أن يكون لديك أطفال يوماً ما؟', 52),
('children', 'How many children do you imagine having, if any?', 'Combien d''enfants imaginez-vous avoir, le cas échéant ?', 'كم طفلاً تتخيل أن لديك، إن وجد؟', 53),
('children', 'If we couldn''t conceive, how far would we go — treatment, adoption, or neither?', 'Si nous ne pouvions pas concevoir, jusqu''où irions-nous — traitement, adoption, ou ni l''un ni l''autre ?', 'إذا لم نتمكن من الإنجاب، إلى أين سنذهب — علاج، تبني، أو لا شيء؟', 54),
('children', 'When is the right time to start trying for kids?', 'Quel est le bon moment pour commencer à essayer d''avoir des enfants ?', 'ما هو الوقت المناسب للبدء في المحاولة لإنجاب الأطفال؟', 55),
('children', 'If one of us wants kids and the other stays unsure, what do we do?', 'Si l''un de nous veut des enfants et l''autre reste incertain, que faisons-nous ?', 'إذا أراد أحدنا أطفالاً والآخر لا يزال متردداً، ماذا نفعل؟', 56),

-- === CHILDREN: Parenting Style ===
('children', 'How were you disciplined as a child, and what would you keep or change?', 'Comment avez-vous été discipliné enfant, et que garderiez-vous ou changeriez-vous ?', 'كيف تم تأديبك كطفل، وماذا ستحتفظ به أو تغيره؟', 57),
('children', 'What role should screens, faith, or diet play in how we raise them?', 'Quel rôle les écrans, la foi ou l''alimentation devraient-ils jouer dans notre éducation ?', 'ما هو دور الشاشات أو الإيمان أو النظام الغذائي في تربيتنا لهم؟', 58),
('children', 'How involved do you want extended family to be in raising our children?', 'Quel rôle voulez-vous donner à la famille élargie dans l''éducation de nos enfants ?', 'ما هو دور العائلة الممتدة التي تريدها في تربية أطفالنا؟', 59),
('children', 'What values are most important to pass on to our children?', 'Quelles valeurs sont les plus importantes à transmettre à nos enfants ?', 'ما هي القيم الأكثر أهمية في نقلها لأطفالنا؟', 60),
('children', 'How will we handle disagreements about parenting in front of the kids?', 'Comment gérerons-nous les désaccords sur l''éducation devant les enfants ?', 'كيف سنتعامل مع خلافات التربية أمام الأطفال؟', 61),

-- === MARRIAGE: Commitment ===
('marriage', 'Do you believe marriage is necessary for a committed relationship?', 'Pensez-vous que le mariage est nécessaire pour une relation engagée ?', 'هل تعتقد أن الزواج ضروري للعلاقة الملتزمة؟', 62),
('marriage', 'What does commitment mean to you beyond being together?', 'Que signifie l''engagement pour vous au-delà d''être ensemble ?', 'ماذا يعني الالتزام بالنسبة لك بخلاف أن تكونا معاً؟', 63),
('marriage', 'When do you feel most committed to our relationship?', 'Quand vous sentez-vous le plus engagé dans notre relation ?', 'متى تشعر بالالتزام بعلاقتنا أكثر؟', 64),
('marriage', 'What would be unforgivable in a relationship for you?', 'Qu''est-ce qui serait impardonnable dans une relation pour vous ?', 'ما هو الشيء غير المقبول في علاقة بالنسبة لك؟', 65),
('marriage', 'Are we in this relationship for the long term, or just seeing where it goes?', 'Sommes-nous dans cette relation pour le long terme, ou on voit où ça nous mène ?', 'هل نحن في هذه العلاقة للمدى الطويل، أم نرى إلى أين نصل؟', 66),

-- === MARRIAGE: Roles & Expectations ===
('marriage', 'How should household chores be divided between us?', 'Comment les tâches ménagères devraient-elles être divisées entre nous ?', 'كيف يجب تقسيم الأعمال المنزلية بيننا؟', 67),
('marriage', 'Should one partner stay home with the children while the other works?', 'Un partenaire devrait-il rester à la maison avec les enfants pendant que l''autre travaille ?', 'هل يجب أن يبقى أحد الشريكين في المنزل مع الأطفال بينما الآخر يعمل؟', 68),
('marriage', 'How do we balance both careers when children arrive?', 'Comment équilibrer les deux carrières quand les enfants arrivent ?', 'كيف نوازن بين المهنتين عند وصول الأطفال؟', 69),
('marriage', 'Who tracks the bills, due dates, and subscriptions?', 'Qui suit les factures, les dates d''échéance et les abonnements ?', 'من يتتبع الفواتير والمواعيد النهائية والاشتراكات؟', 70),
('marriage', 'What are your expectations for how I support your career, and vice versa?', 'Quelles sont vos attentes quant à la façon dont je soutiens votre carrière, et vice versa ?', 'ما هي توقعاتك لكيفية دعمي لمسيرتك المهنية، والعكس صحيح؟', 71);
