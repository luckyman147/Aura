-- Fix: Convert statements to questions
-- Run this in Supabase SQL Editor

update questions set
  text_en = 'Do we handle disagreements in a healthy and constructive way?',
  text_fr = 'Gérons-nous les désaccords de manière saine et constructive?',
  text_ar = 'هل نتعامل مع خلافاتنا بطريقة صحية وبنّاءة؟'
where text_en like 'We handle disagreements%';

update questions set
  text_en = 'Do we feel comfortable expressing our true feelings to each other?',
  text_fr = 'Nous sentons-nous à l''aise pour exprimer nos vrais sentiments l''un envers l''autre?',
  text_ar = 'هل نشعر بالراحة في التعبير عن مشاعرنا الحقيقية لبعضنا؟'
where text_en like 'We feel comfortable%';

update questions set
  text_en = 'Do we listen actively when the other person is speaking?',
  text_fr = 'Écoutons-nous activement quand l''autre personne parle?',
  text_ar = 'هل نستمع بشكل فعّال عندما يتحدث الطرف الآخر؟'
where text_en like 'We listen actively%';

update questions set
  text_en = 'Do we rarely misunderstand each other?',
  text_fr = 'Nous comprenons-nous rarement mal?',
  text_ar = 'هل نادرًا ما نفهم بعضنا بشكل خاطئ؟'
where text_en like 'We rarely%';

update questions set
  text_en = 'Do we share similar core values about family and relationships?',
  text_fr = 'Partageons-nous des valeurs fondamentales similaires sur la famille et les relations?',
  text_ar = 'هل نشارك قيمًا جوهرية متشابهة حول الأسرة والعلاقات؟'
where text_en like 'We share similar core%';

update questions set
  text_en = 'Are we aligned on our long-term life goals and aspirations?',
  text_fr = 'Sommes-nous alignés sur nos objectifs de vie à long terme?',
  text_ar = 'هل نحن متّفقون على أهداف حياتنا طويلة الأمد؟'
where text_en like 'We are aligned%';

update questions set
  text_en = 'Do we have similar views on what matters most in life?',
  text_fr = 'Avons-nous des points de vue similaires sur ce qui compte le plus?',
  text_ar = 'هل لدينا وجهات نظر متشابهة حول ما يهمّ أكثر في الحياة؟'
where text_en like 'We have similar views%';

update questions set
  text_en = 'Do we enjoy spending quality time together on weekends?',
  text_fr = 'Aimons-nous passer du temps de qualité ensemble le week-end?',
  text_ar = 'هل نستمتع بقضاء وقت ممتع معًا في عطلات نهاية الأسبوع؟'
where text_en like 'We enjoy spending%';

update questions set
  text_en = 'Do we have compatible daily routines and habits?',
  text_fr = 'Avons-nous des routines quotidiennes et des habitudes compatibles?',
  text_ar = 'هل لدينا روتين يومي وعادات متوافقة؟'
where text_en like 'We have compatible%';

update questions set
  text_en = 'Do we support each other''s personal hobbies and interests?',
  text_fr = 'Soutenons-nous les hobbies et intérêts personnels de l''un et l''autre?',
  text_ar = 'هل ندعم الهوايات والاهتمامات الشخصية لبعضنا؟'
where text_en like 'We support%';

update questions set
  text_en = 'Do we feel emotionally connected and close?',
  text_fr = 'Nous sentons-nous émotionnellement connectés et proches?',
  text_ar = 'هل نشعر بارتباط عاطفي وقرب؟'
where text_en like 'We feel emotionally%';

update questions set
  text_en = 'Are we satisfied with our physical affection?',
  text_fr = 'Sommes-nous satisfaits de notre affection physique?',
  text_ar = 'هل راضون عن تعبيراتنا الجسدية عن الحب؟'
where text_en like 'We are satisfied%';

update questions set
  text_en = 'Do we have similar attitudes toward saving and spending?',
  text_fr = 'Avons-nous des attitudes similaires vers l''épargne et les dépenses?',
  text_ar = 'هل لدينا مواقف متشابهة تجاه الادخار والإنفاق؟'
where text_en like 'We have similar attitudes%';

update questions set
  text_en = 'Are we open and honest about financial matters?',
  text_fr = 'Sommes-nous ouverts et honnêtes sur les questions financières?',
  text_ar = 'هل نحن مفتوحون وصادقون في Matters المالية؟'
where text_en like 'We are open%';

update questions set
  text_en = 'Do we agree on whether or not to have children?',
  text_fr = 'Sommes-nous d''accord sur le fait d''avoir des enfants ou non?',
  text_ar = 'هل نتفق على ما إذا كان لدينا أطفال أم لا؟'
where text_en like 'We agree on%';

update questions set
  text_en = 'Do we share similar ideas about parenting styles?',
  text_fr = 'Partageons-nous des idées similaires sur les styles d''éducation?',
  text_ar = 'هل نشارك أفكارًا متشابهة حول أساليب تربية الأطفال؟'
where text_en like 'We share similar ideas%';

update questions set
  text_en = 'Do we have similar expectations about marriage?',
  text_fr = 'Avons-nous des attentes similaires sur le mariage?',
  text_ar = 'هل لدينا توقعات متشابهة حول الزواج؟'
where text_en like 'We have similar expectations%';

update questions set
  text_en = 'Are we on the same page about our future together?',
  text_fr = 'Sommes-nous sur la même longueur d''onde concernant notre avenir ensemble?',
  text_ar = 'هل نحن على نفس التوافق بشأن مستقبلنا معًا؟'
where text_en like 'We are on the same%';
