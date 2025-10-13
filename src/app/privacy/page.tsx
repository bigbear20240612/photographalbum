import Container from '@/components/layout/Container';
import Link from 'next/link';

export const metadata = {
  title: '隐私政策 - PhotoAlbum',
  description: 'PhotoAlbum 隐私政策和数据保护说明',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* 页头 */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-4">
              隐私政策
            </h1>
            <p className="text-warm-gray">
              最后更新日期：{new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
            </p>
          </div>

          {/* 内容 */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                1. 引言
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                PhotoAlbum（以下简称"我们"或"本平台"）重视您的隐私。本隐私政策说明了我们如何收集、使用、披露和保护您的个人信息。
              </p>
              <p className="text-warm-gray leading-relaxed">
                使用本平台即表示您同意本隐私政策中描述的信息处理实践。如果您不同意本政策，请不要使用本平台。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                2. 我们收集的信息
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.1 您提供的信息
                  </h3>
                  <p className="text-warm-gray leading-relaxed mb-2">
                    当您注册账户、使用我们的服务或与我们联系时，我们可能会收集以下信息：
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                    <li>账户信息：用户名、电子邮件地址、密码</li>
                    <li>个人资料：显示名称、头像、个人简介、地理位置、网站链接</li>
                    <li>内容信息：您上传的照片、专辑、描述和其他用户生成内容</li>
                    <li>联系信息：社交媒体账号链接（如 Instagram）</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.2 自动收集的信息
                  </h3>
                  <p className="text-warm-gray leading-relaxed mb-2">
                    当您使用本平台时，我们会自动收集某些信息：
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                    <li>设备信息：IP 地址、浏览器类型、操作系统</li>
                    <li>使用数据：访问时间、页面访问记录、功能使用情况</li>
                    <li>Cookie 和类似技术：用于改善用户体验和分析网站性能</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    2.3 照片元数据
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    您上传的照片可能包含 EXIF 元数据（如相机型号、拍摄参数、GPS 位置等）。我们会存储这些信息以提供更好的作品展示效果。您可以选择在上传前删除敏感元数据。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                3. 我们如何使用您的信息
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed mb-2">
                  我们使用收集的信息用于以下目的：
                </p>
                <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                  <li>提供、维护和改进我们的服务</li>
                  <li>创建和管理您的账户</li>
                  <li>展示您的作品和个人资料</li>
                  <li>回应您的请求、评论或问题</li>
                  <li>发送服务相关的通知和更新</li>
                  <li>分析使用趋势和优化用户体验</li>
                  <li>检测、预防和解决技术问题和安全问题</li>
                  <li>遵守法律义务和执行我们的条款和政策</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                4. 信息共享和披露
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.1 公开信息
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    您的个人资料、上传的照片和专辑默认是公开的，任何访问本平台的用户都可以查看。您可以通过隐私设置控制某些内容的可见性。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.2 服务提供商
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    我们可能会与第三方服务提供商共享您的信息，以协助我们提供服务，例如：
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray mt-2">
                    <li>云存储服务提供商（用于存储照片和数据）</li>
                    <li>分析服务提供商（用于网站分析）</li>
                    <li>身份验证服务提供商</li>
                  </ul>
                  <p className="text-warm-gray leading-relaxed mt-2">
                    这些第三方仅被授权在必要范围内使用您的信息，并有义务保护您的数据。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.3 法律要求
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    在以下情况下，我们可能会披露您的信息：
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray mt-2">
                    <li>遵守法律法规、法院命令或政府要求</li>
                    <li>保护我们的权利、财产或安全，或保护用户和公众的安全</li>
                    <li>防止欺诈或其他非法活动</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    4.4 业务转让
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    如果本平台涉及合并、收购或资产出售，您的个人信息可能会被转让。在此情况下，我们会在您的个人信息被转让前通知您。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                5. 数据安全
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed">
                  我们采取合理的技术和组织措施来保护您的个人信息免遭未经授权的访问、使用、披露或破坏。这些措施包括：
                </p>
                <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                  <li>使用加密技术保护数据传输</li>
                  <li>采用安全的数据存储方案</li>
                  <li>限制员工和承包商访问个人信息</li>
                  <li>定期审查和更新安全措施</li>
                </ul>
                <p className="text-warm-gray leading-relaxed mt-4">
                  然而，请注意，没有任何互联网传输或电子存储方法是 100% 安全的。虽然我们努力保护您的个人信息，但我们无法保证其绝对安全。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                6. 数据保留
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                我们会保留您的个人信息，只要您的账户处于活跃状态或在提供服务所需的时间内保留。当您删除账户时，我们会在合理期限内删除或匿名化您的个人信息，除非法律要求我们保留更长时间。
              </p>
              <p className="text-warm-gray leading-relaxed">
                某些信息可能会在备份系统中保留一段时间，但会根据我们的数据保留政策定期清除。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                7. 您的权利
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed mb-2">
                  根据适用的数据保护法律，您拥有以下权利：
                </p>
                <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                  <li><strong className="text-charcoal">访问权：</strong>您有权请求访问我们持有的关于您的个人信息</li>
                  <li><strong className="text-charcoal">更正权：</strong>您可以更新或更正不准确的个人信息</li>
                  <li><strong className="text-charcoal">删除权：</strong>您可以请求删除您的个人信息（某些例外情况除外）</li>
                  <li><strong className="text-charcoal">限制处理权：</strong>您可以请求限制我们对您个人信息的处理</li>
                  <li><strong className="text-charcoal">数据可携权：</strong>您有权以结构化、常用的格式接收您的数据</li>
                  <li><strong className="text-charcoal">反对权：</strong>您可以反对某些类型的数据处理</li>
                </ul>
                <p className="text-warm-gray leading-relaxed mt-4">
                  要行使这些权利，请通过账户设置或联系我们。我们会在合理时间内回应您的请求。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                8. Cookie 和追踪技术
              </h2>
              <div className="space-y-4">
                <p className="text-warm-gray leading-relaxed">
                  我们使用 Cookie 和类似的追踪技术来改善用户体验、分析网站使用情况和提供个性化内容。Cookie 是存储在您设备上的小型文本文件。
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    我们使用的 Cookie 类型：
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-warm-gray">
                    <li><strong className="text-charcoal">必要 Cookie：</strong>用于网站基本功能，如用户登录和会话管理</li>
                    <li><strong className="text-charcoal">分析 Cookie：</strong>帮助我们了解用户如何使用网站</li>
                    <li><strong className="text-charcoal">功能 Cookie：</strong>记住您的偏好设置</li>
                  </ul>
                </div>
                <p className="text-warm-gray leading-relaxed">
                  您可以通过浏览器设置控制或删除 Cookie。但是，禁用某些 Cookie 可能会影响网站功能。
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                9. 儿童隐私
              </h2>
              <p className="text-warm-gray leading-relaxed">
                本平台不面向 13 岁以下的儿童，我们不会有意收集 13 岁以下儿童的个人信息。如果我们发现收集了此类信息，我们会立即删除。如果您认为我们可能持有 13 岁以下儿童的信息，请联系我们。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                10. 国际数据传输
              </h2>
              <p className="text-warm-gray leading-relaxed">
                您的信息可能会被传输到您所在国家/地区以外的服务器，并在那里进行存储和处理。这些国家/地区的数据保护法律可能与您所在国家/地区的法律不同。通过使用本平台，您同意此类传输。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                11. 隐私政策的变更
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                我们可能会不时更新本隐私政策。当我们进行重大变更时，我们会通过电子邮件或在网站上发布通知来通知您。变更生效后，您继续使用本平台即表示您接受修订后的政策。
              </p>
              <p className="text-warm-gray leading-relaxed">
                我们建议您定期查看本页面以了解我们如何保护您的信息。
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                12. 联系我们
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：
              </p>
              <div className="bg-warm-beige/30 rounded-xl p-6">
                <p className="text-warm-gray">
                  <strong className="text-charcoal">平台名称：</strong>PhotoAlbum
                </p>
                <p className="text-warm-gray mt-2">
                  <strong className="text-charcoal">联系方式：</strong>通过平台内消息系统或用户反馈功能
                </p>
                <p className="text-warm-gray mt-2">
                  <strong className="text-charcoal">回应时间：</strong>我们会在收到您的请求后 30 天内回复
                </p>
              </div>
            </section>
          </div>

          {/* 相关链接 */}
          <div className="mt-12 pt-8 border-t border-border-light">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/terms"
                className="text-terra-cotta hover:text-terra-cotta/80 transition-colors"
              >
                使用条款
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
