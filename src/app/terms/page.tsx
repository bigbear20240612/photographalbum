import Container from '@/components/layout/Container';
import Link from 'next/link';

export const metadata = {
  title: '使用条款 - PhotoAlbum',
  description: 'PhotoAlbum 使用条款和服务协议',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* 页头 */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-4">
              使用条款
            </h1>
            <p className="text-warm-gray">
              最后更新日期：{new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
            </p>
          </div>

          {/* 内容 */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                1. 服务条款的接受
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                欢迎使用 PhotoAlbum（以下简称"本平台"）。通过访问或使用本平台，您同意遵守以下使用条款。如果您不同意这些条款，请勿使用本平台。
              </p>
              <p className="text-warm-gray leading-relaxed">
                本平台保留随时修改这些条款的权利。您继续使用本平台即表示您接受修订后的条款。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                2. 用户账户
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.1 账户注册
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    您需要注册一个账户才能使用本平台的完整功能。在注册时，您必须提供准确、完整的信息，并及时更新这些信息以保持准确性。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.2 账户安全
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    您有责任保护您的账户密码和账户安全。您应对您账户下发生的所有活动负责。如果您发现任何未经授权使用您账户的情况，请立即通知我们。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.3 账户使用限制
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    每个用户只能注册一个账户。禁止创建虚假账户或冒用他人身份注册账户。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                3. 内容使用规范
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    3.1 用户内容
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    您对上传到本平台的所有内容（包括照片、文字、描述等）负有全部责任。您保证您拥有上传内容的所有必要权利，包括版权、肖像权等。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    3.2 内容授权
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    通过在本平台上传内容，您授予本平台非独占的、全球性的、免费的许可，以存储、展示和传播您的内容，用于提供和推广本平台服务。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    3.3 禁止内容
                  </h3>
                  <p className="text-warm-gray leading-relaxed mb-2">
                    禁止上传以下类型的内容：
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                    <li>违反法律法规的内容</li>
                    <li>侵犯他人知识产权、隐私权或其他权利的内容</li>
                    <li>包含色情、暴力、仇恨言论或其他不当内容</li>
                    <li>垃圾信息、广告或其他未经授权的商业内容</li>
                    <li>恶意软件、病毒或其他有害代码</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                4. 知识产权
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.1 平台内容
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    本平台的所有内容，包括但不限于文本、图形、标志、图标、图像、音频片段、数字下载、数据汇编和软件，均属于本平台或其内容供应商的财产，受版权法保护。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.2 用户内容版权
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    用户保留其上传内容的所有权利。本平台尊重知识产权，如果您认为您的作品被侵权，请通过平台提供的方式联系我们。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                5. 服务使用限制
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed">
                  在使用本平台时，您同意不会：
                </p>
                <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                  <li>使用任何自动化工具访问或使用本平台</li>
                  <li>干扰或破坏本平台的正常运行</li>
                  <li>尝试未经授权访问本平台的任何部分</li>
                  <li>收集或存储其他用户的个人信息</li>
                  <li>从事任何可能损害本平台声誉的行为</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                6. 免责声明
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed">
                  本平台按"现状"和"可用"基础提供服务，不提供任何明示或暗示的担保。本平台不保证服务将不间断、及时、安全或无错误。
                </p>
                <p className="text-warm-gray leading-relaxed">
                  本平台不对用户上传的内容负责，也不对因使用或无法使用本平台而导致的任何直接、间接、偶然、特殊或后果性损害承担责任。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                7. 服务变更和终止
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed">
                  本平台保留随时修改、暂停或终止服务（或其任何部分）的权利，无论是否事先通知。本平台不对服务的修改、暂停或终止承担责任。
                </p>
                <p className="text-warm-gray leading-relaxed">
                  如果您违反本条款，本平台有权立即终止您的账户，无需事先通知。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                8. 适用法律
              </h2>
              <p className="text-warm-gray leading-relaxed">
                本使用条款受中华人民共和国法律管辖。因本条款引起的或与本条款有关的任何争议，应通过友好协商解决；协商不成的，任何一方均可向本平台所在地有管辖权的人民法院提起诉讼。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                9. 联系我们
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                如果您对本使用条款有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <div className="bg-warm-beige/30 rounded-xl p-6">
                <p className="text-warm-gray">
                  <strong className="text-charcoal">平台名称：</strong>PhotoAlbum
                </p>
                <p className="text-warm-gray mt-2">
                  <strong className="text-charcoal">联系方式：</strong>通过平台内消息系统或用户反馈功能
                </p>
              </div>
            </section>
          </div>

          {/* 相关链接 */}
          <div className="mt-12 pt-8 border-t border-border-light">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/privacy"
                className="text-terra-cotta hover:text-terra-cotta/80 transition-colors"
              >
                隐私政策
              </Link>
              <span className="text-warm-gray">|</span>
              <Link
                href="/about"
                className="text-terra-cotta hover:text-terra-cotta/80 transition-colors"
              >
                关于我们
              </Link>
              <span className="text-warm-gray">|</span>
              <Link
                href="/"
                className="text-terra-cotta hover:text-terra-cotta/80 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
